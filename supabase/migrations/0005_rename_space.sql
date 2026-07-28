-- 스페이스 이름 변경 RPC
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

create or replace function rename_space(target_space_id uuid, new_name text)
returns spaces
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_space spaces;
  trimmed_name text;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  trimmed_name := trim(new_name);
  if trimmed_name = '' then
    raise exception '스페이스 이름을 입력해주세요.';
  end if;

  if not exists (
    select 1 from space_members
    where space_id = target_space_id and user_id = auth.uid()
  ) then
    raise exception '이 스페이스의 멤버만 이름을 변경할 수 있습니다.';
  end if;

  update spaces set name = trimmed_name
    where id = target_space_id
    returning * into updated_space;

  return updated_space;
end;
$$;

grant execute on function rename_space(uuid, text) to authenticated;
