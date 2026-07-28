-- 초대 코드 보안 강화
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

-- ---------------------------------------------------------------------
-- 1. 스키마: 초대 코드 만료 시각 추가
-- ---------------------------------------------------------------------

alter table spaces
  add column if not exists invite_code_expires_at timestamptz;

-- 기존 코드도 발급 시점 기준 24시간 후 만료로 맞춰줌
update spaces
  set invite_code_expires_at = created_at + interval '24 hours'
  where invite_code_expires_at is null;

alter table spaces
  alter column invite_code_expires_at set not null;

-- 참여 시도 로그 (rate limiting 용, 클라이언트에서 직접 접근 불가)
create table if not exists space_join_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table space_join_attempts enable row level security;
-- 정책 없음: security definer 함수를 통해서만 접근

create index if not exists space_join_attempts_user_id_created_at_idx
  on space_join_attempts (user_id, created_at);

-- ---------------------------------------------------------------------
-- 2. 초대 코드 생성 헬퍼 (8~10자, 영문 대문자 + 숫자, 혼동되는 0/O/1/I/L 제외)
-- ---------------------------------------------------------------------

create or replace function generate_invite_code(code_length int default 10)
returns text
language plpgsql
as $$
declare
  chars constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  result text := '';
  i int;
begin
  for i in 1..code_length loop
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  end loop;
  return result;
end;
$$;

-- ---------------------------------------------------------------------
-- 3. 스페이스 생성: 코드 길이 확장 + 24시간 만료
-- ---------------------------------------------------------------------

create or replace function create_space(space_name text)
returns spaces
language plpgsql
security definer
set search_path = public
as $$
declare
  new_space spaces;
  new_code text;
  attempt int := 0;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  loop
    attempt := attempt + 1;
    new_code := generate_invite_code(10);
    begin
      insert into spaces (name, invite_code, invite_code_expires_at, created_by)
      values (trim(space_name), new_code, now() + interval '24 hours', auth.uid())
      returning * into new_space;
      exit;
    exception when unique_violation then
      if attempt >= 5 then
        raise exception '초대 코드 생성에 실패했습니다. 다시 시도해주세요.';
      end if;
    end;
  end loop;

  insert into space_members (space_id, user_id, role)
  values (new_space.id, auth.uid(), 'owner');

  insert into space_settings (space_id) values (new_space.id);

  return new_space;
end;
$$;

-- ---------------------------------------------------------------------
-- 4. 초대 코드 재생성 (설정 탭에서 멤버가 호출)
-- ---------------------------------------------------------------------

create or replace function regenerate_invite_code(target_space_id uuid)
returns spaces
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_space spaces;
  new_code text;
  attempt int := 0;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  if not exists (
    select 1 from space_members
    where space_id = target_space_id and user_id = auth.uid()
  ) then
    raise exception '이 스페이스의 멤버만 초대 코드를 재생성할 수 있습니다.';
  end if;

  loop
    attempt := attempt + 1;
    new_code := generate_invite_code(10);
    begin
      update spaces
        set invite_code = new_code,
            invite_code_expires_at = now() + interval '24 hours'
        where id = target_space_id
        returning * into updated_space;
      exit;
    exception when unique_violation then
      if attempt >= 5 then
        raise exception '초대 코드 생성에 실패했습니다. 다시 시도해주세요.';
      end if;
    end;
  end loop;

  return updated_space;
end;
$$;

grant execute on function regenerate_invite_code(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 5. 참여: 만료 체크 + rate limiting (10분 내 5회 실패 시 잠금)
-- ---------------------------------------------------------------------

create or replace function join_space(code text)
returns spaces
language plpgsql
security definer
set search_path = public
as $$
declare
  target_space spaces;
  recent_attempts int;
  max_attempts constant int := 5;
  window_minutes constant int := 10;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  delete from space_join_attempts
    where user_id = auth.uid()
      and created_at < now() - (window_minutes || ' minutes')::interval;

  select count(*) into recent_attempts
    from space_join_attempts
    where user_id = auth.uid();

  if recent_attempts >= max_attempts then
    raise exception '너무 많은 시도가 감지되었습니다. % 분 후 다시 시도해주세요.', window_minutes;
  end if;

  select * into target_space
    from spaces
    where invite_code = upper(trim(code))
      and invite_code_expires_at > now();

  if target_space.id is null then
    insert into space_join_attempts (user_id) values (auth.uid());
    raise exception '유효하지 않거나 만료된 초대 코드입니다.';
  end if;

  insert into space_members (space_id, user_id, role)
  values (target_space.id, auth.uid(), 'member')
  on conflict (space_id, user_id) do nothing;

  delete from space_join_attempts where user_id = auth.uid();

  return target_space;
end;
$$;

grant execute on function create_space(text) to authenticated;
grant execute on function join_space(text) to authenticated;
