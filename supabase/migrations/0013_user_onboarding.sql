-- 첫 사용자 온보딩 튜토리얼을 봤는지(또는 건너뛰며 "다시 보지 않기"를
-- 선택했는지) 기록한다. 행이 존재하면 다시 보여주지 않는다.
create table if not exists user_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dismissed_at timestamptz not null default now()
);

alter table user_onboarding enable row level security;

create policy "manage own onboarding status" on user_onboarding
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
