-- 유통기한 임박 알림을 보내기 위한 Web Push 구독 정보.
-- (스페이스가 아니라 사용자 1명 = 브라우저/기기 1개 기준으로 저장한다)

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

-- 본인 구독만 등록/조회/삭제 가능. 유통기한 체크 크론 작업은 서비스 롤 키로
-- RLS를 우회해 모든 사용자의 구독을 조회한다.
create policy "manage own push subscriptions" on push_subscriptions
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
