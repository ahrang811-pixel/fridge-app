-- 레시피에 원본 인스타그램 게시물 링크를 참고용으로 저장한다.
-- (유튜브와 달리 공식 임베드를 쓰지 않고, 상세 화면에서 링크로만 연결한다.)
alter table recipes add column if not exists instagram_url text;
