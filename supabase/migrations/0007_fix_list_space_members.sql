-- list_space_members 버그 수정
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.
--
-- 문제: `returns table (user_id uuid, ...)`로 선언하면 PL/pgSQL이 user_id를
-- 함수 본문 전체에서 쓸 수 있는 지역 변수로 자동 선언한다. 멤버십 확인
-- 쿼리에서 테이블 alias 없이 `user_id = auth.uid()`라고 쓰면 이 컬럼이
-- space_members.user_id가 아니라 그 지역 변수(항상 NULL)를 가리키게 되어
-- 호출자 본인의 멤버십 확인이 의도대로 동작하지 않았다.
-- 아래에서는 모든 컬럼 참조에 테이블 alias(sm)를 명시하고,
-- #variable_conflict use_column 을 추가해 앞으로도 같은 종류의 버그가
-- 재발하지 않도록 한다.

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
#variable_conflict use_column
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  if not exists (
    select 1 from space_members sm
    where sm.space_id = target_space_id and sm.user_id = auth.uid()
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
