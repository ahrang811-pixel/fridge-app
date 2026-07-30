-- 회원탈퇴 지원: 소유권 위임 + 계정(및 관련 데이터) 삭제.
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

-- ---------------------------------------------------------------------
-- 1. 탈퇴를 막는 스페이스 목록 (본인이 owner이면서 다른 멤버가 있는 스페이스)
-- ---------------------------------------------------------------------

create or replace function get_account_deletion_blockers()
returns table (space_id uuid, space_name text, member_count bigint)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  return query
    select s.id, s.name, count(sm2.user_id)
    from space_members sm
    join spaces s on s.id = sm.space_id
    join space_members sm2 on sm2.space_id = sm.space_id
    where sm.user_id = auth.uid() and sm.role = 'owner'
    group by s.id, s.name
    having count(sm2.user_id) > 1;
end;
$$;

grant execute on function get_account_deletion_blockers() to authenticated;

-- ---------------------------------------------------------------------
-- 2. 스페이스 소유권 위임 (owner만 가능, 같은 스페이스 멤버에게만)
-- ---------------------------------------------------------------------

create or replace function transfer_space_ownership(
  target_space_id uuid,
  new_owner_user_id uuid
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

  if new_owner_user_id = auth.uid() then
    raise exception '본인에게는 위임할 수 없습니다.';
  end if;

  select role into caller_role
    from space_members
    where space_id = target_space_id and user_id = auth.uid();

  if caller_role is distinct from 'owner' then
    raise exception 'owner만 소유권을 위임할 수 있습니다.';
  end if;

  select role into target_role
    from space_members
    where space_id = target_space_id and user_id = new_owner_user_id;

  if target_role is null then
    raise exception '해당 사용자는 이 스페이스의 멤버가 아닙니다.';
  end if;

  update space_members set role = 'owner'
    where space_id = target_space_id and user_id = new_owner_user_id;

  update space_members set role = 'admin'
    where space_id = target_space_id and user_id = auth.uid();
end;
$$;

grant execute on function transfer_space_ownership(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 3. 회원탈퇴 준비: 계정 삭제 전에 스페이스/데이터를 정리한다.
--    - 본인이 owner이면서 유일한 멤버인 스페이스: 스페이스째로 삭제
--      (ingredients/shopping_items/meal_plans/recipes/space_members/
--       space_settings는 spaces에 on delete cascade로 걸려 있어 함께 삭제됨)
--    - 본인이 owner가 아닌 스페이스: 멤버십만 제거(스페이스는 유지)
--    - 다른 멤버가 있는데 본인이 owner인 스페이스가 남아있으면 안전을 위해
--      중단한다 (프론트에서 미리 get_account_deletion_blockers로 안내해야 함)
--
--    주의: 계정(auth.users) 자체는 여기서 지우지 않는다. spaces.created_by가
--    on delete cascade가 아니라 on delete set null이라, auth.users를 먼저
--    지워버리면 본인이 owner였던 스페이스가 초대 코드가 살아있는 채로
--    멤버 0명인 상태로 고아처럼 남는다(직접 확인함). 그래서 스페이스 정리를
--    먼저 이 함수로 끝내고, 계정 자체는 서버리스 함수에서 Supabase Auth
--    Admin API(auth.admin.deleteUser)로 삭제한다 - 그래야 auth 스키마 내부
--    정리(세션/식별자 등)까지 공식적으로 처리된다.
--    api_usage/notification_settings/push_subscriptions/user_onboarding은
--    auth.users에 on delete cascade로 걸려 있어 그 때 함께 삭제된다.
-- ---------------------------------------------------------------------

create or replace function prepare_account_deletion()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  blocker_count int;
  solo_space record;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  select count(*) into blocker_count from get_account_deletion_blockers();
  if blocker_count > 0 then
    raise exception '다른 멤버가 있는 스페이스의 소유권을 먼저 위임해주세요.';
  end if;

  for solo_space in
    select sm.space_id
    from space_members sm
    where sm.user_id = auth.uid() and sm.role = 'owner'
  loop
    delete from spaces where id = solo_space.space_id;
  end loop;

  delete from space_members where user_id = auth.uid();
end;
$$;

grant execute on function prepare_account_deletion() to authenticated;
