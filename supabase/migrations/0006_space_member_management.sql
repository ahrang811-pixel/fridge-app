-- 스페이스 멤버 관리 (멤버 목록 / 관리자 지정 / 강퇴 / 나가기)
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.
--
-- 모든 권한 검사는 클라이언트가 아니라 아래 security definer 함수 내부에서
-- 수행됩니다. 클라이언트는 함수를 호출만 할 수 있고, 실제 owner/관리자
-- 여부는 매 호출마다 space_members 테이블을 조회해 서버에서 재확인합니다.

-- ---------------------------------------------------------------------
-- 1. role 값 제약 (owner / admin / member)
-- ---------------------------------------------------------------------

alter table space_members drop constraint if exists space_members_role_check;
alter table space_members
  add constraint space_members_role_check check (role in ('owner', 'admin', 'member'));

-- ---------------------------------------------------------------------
-- 2. 멤버 목록 조회 (이메일 포함)
--    auth.users는 클라이언트에서 직접 조회할 수 없으므로,
--    같은 스페이스 멤버인지 확인 후 이메일을 함께 반환한다.
-- ---------------------------------------------------------------------

create or replace function list_space_members(target_space_id uuid)
returns table (
  user_id uuid,
  email text,
  role text,
  joined_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  if not exists (
    select 1 from space_members
    where space_id = target_space_id and user_id = auth.uid()
  ) then
    raise exception '이 스페이스의 멤버만 조회할 수 있습니다.';
  end if;

  return query
    select sm.user_id, u.email::text, sm.role, sm.joined_at
    from space_members sm
    join auth.users u on u.id = sm.user_id
    where sm.space_id = target_space_id
    order by
      (sm.role = 'owner') desc,
      (sm.role = 'admin') desc,
      sm.joined_at asc;
end;
$$;

grant execute on function list_space_members(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 3. 관리자 지정 / 해제 (owner만 가능)
-- ---------------------------------------------------------------------

create or replace function set_member_role(
  target_space_id uuid,
  target_user_id uuid,
  new_role text
)
returns space_members
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
  target_row space_members;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  if new_role not in ('admin', 'member') then
    raise exception '허용되지 않는 역할입니다.';
  end if;

  select role into caller_role
    from space_members
    where space_id = target_space_id and user_id = auth.uid();

  if caller_role is distinct from 'owner' then
    raise exception '관리자 지정/해제는 owner만 할 수 있습니다.';
  end if;

  if target_user_id = auth.uid() then
    raise exception '본인의 역할은 변경할 수 없습니다.';
  end if;

  select * into target_row
    from space_members
    where space_id = target_space_id and user_id = target_user_id;

  if target_row.user_id is null then
    raise exception '해당 멤버를 찾을 수 없습니다.';
  end if;

  if target_row.role = 'owner' then
    raise exception 'owner의 역할은 변경할 수 없습니다.';
  end if;

  update space_members
    set role = new_role
    where space_id = target_space_id and user_id = target_user_id
    returning * into target_row;

  return target_row;
end;
$$;

grant execute on function set_member_role(uuid, uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- 4. 멤버 강퇴 (owner 또는 관리자만 가능, 본인/owner는 대상 불가)
--    space_members에서 즉시 삭제되므로, 강퇴당한 사용자는 다음 요청부터
--    바로 RLS에 의해 해당 스페이스의 모든 데이터 접근이 차단된다.
-- ---------------------------------------------------------------------

create or replace function remove_space_member(
  target_space_id uuid,
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
  target_role text;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  if target_user_id = auth.uid() then
    raise exception '본인은 강퇴할 수 없습니다. 스페이스 나가기를 이용해주세요.';
  end if;

  select role into caller_role
    from space_members
    where space_id = target_space_id and user_id = auth.uid();

  if caller_role is null or caller_role not in ('owner', 'admin') then
    raise exception 'owner 또는 관리자만 멤버를 내보낼 수 있습니다.';
  end if;

  select role into target_role
    from space_members
    where space_id = target_space_id and user_id = target_user_id;

  if target_role is null then
    raise exception '해당 멤버를 찾을 수 없습니다.';
  end if;

  if target_role = 'owner' then
    raise exception 'owner는 내보낼 수 없습니다.';
  end if;

  delete from space_members
    where space_id = target_space_id and user_id = target_user_id;
end;
$$;

grant execute on function remove_space_member(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 5. 스페이스 나가기 (본인, owner는 불가)
-- ---------------------------------------------------------------------

create or replace function leave_space(target_space_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  select role into caller_role
    from space_members
    where space_id = target_space_id and user_id = auth.uid();

  if caller_role is null then
    raise exception '이 스페이스의 멤버가 아닙니다.';
  end if;

  if caller_role = 'owner' then
    raise exception 'owner는 스페이스를 나갈 수 없습니다.';
  end if;

  delete from space_members
    where space_id = target_space_id and user_id = auth.uid();
end;
$$;

grant execute on function leave_space(uuid) to authenticated;
