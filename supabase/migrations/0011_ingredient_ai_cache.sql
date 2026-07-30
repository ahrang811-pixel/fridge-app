-- 식재료 이름 기준 AI 생성 콘텐츠 캐시 (이미지, 최대 보관기한/구입 꿀팁).
-- 스페이스에 종속되지 않는 전역 캐시: 같은 이름의 식재료는 어느 스페이스에서
-- 등록하든 한 번만 생성해서 재사용한다. 쓰기는 서버리스 함수(service role)만
-- 수행하고, RLS는 로그인한 사용자의 조회만 허용한다.

create table if not exists ingredient_images (
  name text primary key,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists ingredient_ai_facts (
  name text primary key,
  max_storage_days int,
  buying_tip text,
  created_at timestamptz not null default now()
);

alter table ingredient_images enable row level security;
alter table ingredient_ai_facts enable row level security;

create policy "authenticated read ingredient images" on ingredient_images
  for select
  using (auth.uid() is not null);

create policy "authenticated read ingredient facts" on ingredient_ai_facts
  for select
  using (auth.uid() is not null);

-- 생성된 식재료 일러스트를 저장하는 공개 읽기 버킷. 업로드는 서버리스
-- 함수(service role)에서만 수행하므로 별도의 storage.objects insert 정책은 두지 않는다.
insert into storage.buckets (id, name, public)
values ('ingredient-images', 'ingredient-images', true)
on conflict (id) do nothing;

create policy "public read ingredient image files" on storage.objects
  for select
  using (bucket_id = 'ingredient-images');
