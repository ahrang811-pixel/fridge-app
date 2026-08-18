-- 레시피에 썸네일 이미지 URL을 저장할 수 있도록 컬럼을 추가한다.
-- 인스타그램 게시물을 가져올 때 og:image에서 자동으로 채워지고, 그 외에는 비워둔다.
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

alter table recipes add column if not exists thumbnail_url text;
