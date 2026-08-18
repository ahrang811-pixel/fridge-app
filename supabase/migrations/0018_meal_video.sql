-- 식단 메뉴에 유튜브/인스타그램 영상을 연결할 수 있도록 meal_plans에 컬럼을 추가한다.
-- video_type: 'youtube' | 'instagram' | null. video_ref: youtube면 영상 ID,
-- instagram이면 게시물 URL 전체.
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

alter table meal_plans add column if not exists video_type text;
alter table meal_plans add column if not exists video_ref text;
