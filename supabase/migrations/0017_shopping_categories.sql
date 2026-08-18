-- 장보기 목록에도 식재료/레시피처럼 사용자 정의 카테고리(예: 롯데마트, 이마트, 컬리 등)를
-- 쓸 수 있도록 space_settings에 shopping_categories를 추가하고, shopping_items에
-- 항목별 category 컬럼을 추가한다.
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 붙여넣고 Run 하세요.

alter table space_settings
  add column if not exists shopping_categories text[] not null default array[
    '마트', '온라인', '편의점', '기타'
  ];

alter table shopping_items
  add column if not exists category text not null default '기타';
