-- 사용자별 AI 기능(레시피 추천/유튜브 레시피 분석) 하루 사용 횟수 제한

create table if not exists api_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null,
  usage_date date not null default (now() at time zone 'utc')::date,
  count integer not null default 0,
  primary key (user_id, feature, usage_date)
);

alter table api_usage enable row level security;

create policy "select own usage" on api_usage
  for select
  using (user_id = auth.uid());

-- 오늘 사용 횟수를 확인하고, 한도 내라면 원자적으로 1 증가시킨 뒤 결과를 반환한다.
-- (row lock으로 동시 요청이 한도를 넘겨 통과하는 것을 방지)
create or replace function check_and_increment_usage(p_feature text, p_daily_limit int)
returns table(allowed boolean, remaining int)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count int;
  today date := (now() at time zone 'utc')::date;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  insert into api_usage (user_id, feature, usage_date, count)
  values (auth.uid(), p_feature, today, 0)
  on conflict (user_id, feature, usage_date) do nothing;

  select count into current_count
  from api_usage
  where user_id = auth.uid() and feature = p_feature and usage_date = today
  for update;

  if current_count >= p_daily_limit then
    return query select false, 0;
    return;
  end if;

  update api_usage
  set count = count + 1
  where user_id = auth.uid() and feature = p_feature and usage_date = today;

  return query select true, (p_daily_limit - current_count - 1);
end;
$$;

grant execute on function check_and_increment_usage(text, int) to authenticated;
