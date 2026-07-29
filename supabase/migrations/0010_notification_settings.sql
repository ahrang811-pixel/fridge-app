-- 유통기한 임박 알림을 받을 시간(0~23, KST 기준 정시) 사용자 설정.
-- 기본값은 오전 9시.

create table if not exists notification_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notify_hour smallint not null default 9 check (notify_hour between 0 and 23),
  updated_at timestamptz not null default now()
);

alter table notification_settings enable row level security;

-- 본인 설정만 등록/조회/수정 가능. 유통기한 체크 크론 작업은 서비스 롤 키로
-- RLS를 우회해 모든 사용자의 설정을 조회한다.
create policy "manage own notification settings" on notification_settings
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
