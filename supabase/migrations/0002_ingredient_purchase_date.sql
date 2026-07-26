-- 식재료 "구매일" 필드 추가
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

alter table ingredients add column if not exists purchase_date date;
