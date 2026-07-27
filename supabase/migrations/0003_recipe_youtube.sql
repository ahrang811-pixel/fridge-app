-- 레시피에 원본 유튜브 영상을 연결해 앱 안에서 임베드 재생할 수 있게 한다.
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

alter table recipes add column if not exists youtube_video_id text;
