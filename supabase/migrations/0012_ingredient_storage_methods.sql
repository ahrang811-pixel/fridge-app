-- 식재료 상세 화면의 "보관 방법"을 카테고리 공통 안내 하나가 아니라, 식재료별로
-- 여러 보관 방식(예: 냉장/냉동)과 각 방식에 맞는 소비기간·구체적 노하우를
-- 보여주기 위한 컬럼. [{method, period, tips}, ...] 형태의 JSON 배열을 저장한다.
alter table ingredient_ai_facts
  add column if not exists storage_methods jsonb;
