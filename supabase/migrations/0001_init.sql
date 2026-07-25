-- 냉장고 정리 앱: 스페이스 기반 스키마
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. 스페이스 / 멤버십
-- ---------------------------------------------------------------------

create table if not exists spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists space_members (
  space_id uuid not null references spaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id)
);

create table if not exists space_settings (
  space_id uuid primary key references spaces(id) on delete cascade,
  ingredient_categories text[] not null default array[
    '채소', '과일', '육류', '수산물', '유제품',
    '곡류/가공식품', '소스/양념', '냉동식품', '음료', '기타'
  ],
  recipe_categories text[] not null default array[
    '한식', '양식', '중식', '일식', '분식', '디저트', '기타'
  ],
  meal_types jsonb not null default '[
    {"id": "breakfast", "label": "아침", "enabled": true},
    {"id": "lunch", "label": "점심", "enabled": true},
    {"id": "dinner", "label": "저녁", "enabled": true}
  ]'::jsonb
);

-- ---------------------------------------------------------------------
-- 2. 데이터 테이블 (모두 space_id로 소속)
-- ---------------------------------------------------------------------

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references spaces(id) on delete cascade,
  name text not null,
  quantity text not null default '',
  category text not null,
  expiry_date date,
  created_at timestamptz not null default now()
);

create table if not exists shopping_items (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references spaces(id) on delete cascade,
  name text not null,
  quantity text not null default '',
  checked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references spaces(id) on delete cascade,
  date date not null,
  meal_type text not null,
  menu text not null default '',
  unique (space_id, date, meal_type)
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references spaces(id) on delete cascade,
  name text not null,
  category text not null,
  ingredients text not null default '',
  instructions text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. RLS
-- ---------------------------------------------------------------------

alter table spaces enable row level security;
alter table space_members enable row level security;
alter table space_settings enable row level security;
alter table ingredients enable row level security;
alter table shopping_items enable row level security;
alter table meal_plans enable row level security;
alter table recipes enable row level security;

-- 내가 속한 스페이스만 조회 가능 (생성/참여는 아래 RPC로만 처리)
create policy "select own spaces" on spaces
  for select
  using (id in (select space_id from space_members where user_id = auth.uid()));

-- 내 멤버십 행만 조회 가능
create policy "select own membership" on space_members
  for select
  using (user_id = auth.uid());

-- 스페이스 설정: 해당 스페이스 멤버만 조회/수정 가능
create policy "space members read settings" on space_settings
  for select
  using (space_id in (select space_id from space_members where user_id = auth.uid()));

create policy "space members update settings" on space_settings
  for update
  using (space_id in (select space_id from space_members where user_id = auth.uid()))
  with check (space_id in (select space_id from space_members where user_id = auth.uid()));

-- 데이터 테이블: 해당 스페이스 멤버만 CRUD 가능
create policy "space members access" on ingredients
  for all
  using (space_id in (select space_id from space_members where user_id = auth.uid()))
  with check (space_id in (select space_id from space_members where user_id = auth.uid()));

create policy "space members access" on shopping_items
  for all
  using (space_id in (select space_id from space_members where user_id = auth.uid()))
  with check (space_id in (select space_id from space_members where user_id = auth.uid()));

create policy "space members access" on meal_plans
  for all
  using (space_id in (select space_id from space_members where user_id = auth.uid()))
  with check (space_id in (select space_id from space_members where user_id = auth.uid()));

create policy "space members access" on recipes
  for all
  using (space_id in (select space_id from space_members where user_id = auth.uid()))
  with check (space_id in (select space_id from space_members where user_id = auth.uid()));

-- ---------------------------------------------------------------------
-- 4. 스페이스 생성 / 초대 코드 참여 RPC
--    (spaces/space_members는 클라이언트에서 직접 insert할 수 없고
--     아래 함수를 통해서만 생성/참여 가능하도록 설계)
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
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  insert into spaces (name, invite_code, created_by)
  values (trim(space_name), new_code, auth.uid())
  returning * into new_space;

  insert into space_members (space_id, user_id, role)
  values (new_space.id, auth.uid(), 'owner');

  insert into space_settings (space_id) values (new_space.id);

  return new_space;
end;
$$;

create or replace function join_space(code text)
returns spaces
language plpgsql
security definer
set search_path = public
as $$
declare
  target_space spaces;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  select * into target_space from spaces where invite_code = upper(trim(code));

  if target_space.id is null then
    raise exception '유효하지 않은 초대 코드입니다.';
  end if;

  insert into space_members (space_id, user_id, role)
  values (target_space.id, auth.uid(), 'member')
  on conflict (space_id, user_id) do nothing;

  return target_space;
end;
$$;

grant execute on function create_space(text) to authenticated;
grant execute on function join_space(text) to authenticated;
