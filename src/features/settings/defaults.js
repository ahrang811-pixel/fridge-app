export const FALLBACK_CATEGORY = '기타'

export const DEFAULT_INGREDIENT_CATEGORIES = [
  '채소',
  '과일',
  '육류',
  '수산물',
  '유제품',
  '곡류/가공식품',
  '소스/양념',
  '냉동식품',
  '음료',
  '기타',
]

export const DEFAULT_RECIPE_CATEGORIES = [
  '한식',
  '양식',
  '중식',
  '일식',
  '분식',
  '디저트',
  '기타',
]

export const DEFAULT_MEAL_TYPES = [
  { id: 'breakfast', label: '아침', enabled: true },
  { id: 'lunch', label: '점심', enabled: true },
  { id: 'dinner', label: '저녁', enabled: true },
]

export const FONT_OPTIONS = [
  {
    id: 'system',
    label: '시스템 기본',
    group: '고딕',
    family: 'system-ui, "Segoe UI", Roboto, sans-serif',
  },
  {
    id: 'noto-sans-kr',
    label: 'Noto Sans KR',
    group: '고딕',
    family: '"Noto Sans KR", sans-serif',
  },
  {
    id: 'nanum-gothic',
    label: 'Nanum Gothic',
    group: '고딕',
    family: '"Nanum Gothic", sans-serif',
  },
  {
    id: 'gowun-dodum',
    label: 'Gowun Dodum',
    group: '고딕',
    family: '"Gowun Dodum", sans-serif',
  },
  {
    id: 'noto-serif-kr',
    label: 'Noto Serif KR',
    group: '세리프',
    family: '"Noto Serif KR", serif',
  },
  {
    id: 'nanum-myeongjo',
    label: 'Nanum Myeongjo',
    group: '세리프',
    family: '"Nanum Myeongjo", serif',
  },
  {
    id: 'gowun-batang',
    label: 'Gowun Batang',
    group: '세리프',
    family: '"Gowun Batang", serif',
  },
  {
    id: 'song-myung',
    label: 'Song Myung',
    group: '세리프',
    family: '"Song Myung", serif',
  },
  {
    id: 'jua',
    label: 'Jua',
    group: '라운드',
    family: '"Jua", sans-serif',
  },
  {
    id: 'do-hyeon',
    label: 'Do Hyeon',
    group: '라운드',
    family: '"Do Hyeon", sans-serif',
  },
  {
    id: 'black-han-sans',
    label: 'Black Han Sans',
    group: '라운드',
    family: '"Black Han Sans", sans-serif',
  },
  {
    id: 'nanum-pen-script',
    label: 'Nanum Pen Script',
    group: '손글씨',
    family: '"Nanum Pen Script", cursive',
  },
  {
    id: 'gaegu',
    label: 'Gaegu',
    group: '손글씨',
    family: '"Gaegu", cursive',
  },
  {
    id: 'poor-story',
    label: 'Poor Story',
    group: '손글씨',
    family: '"Poor Story", cursive',
  },
  {
    id: 'hi-melody',
    label: 'Hi Melody',
    group: '손글씨',
    family: '"Hi Melody", cursive',
  },
  {
    id: 'east-sea-dokdo',
    label: 'East Sea Dokdo',
    group: '손글씨',
    family: '"East Sea Dokdo", cursive',
  },
]

export const DEFAULT_FONT_ID = 'system'

// 카테고리/끼니 설정은 스페이스 멤버가 공유해야 하므로 Supabase의
// space_settings 테이블에 저장한다 (useSpaceSettings 참고).
// 폰트는 기기별 개인 취향이므로 계속 localStorage에 저장한다.
export const SETTINGS_KEYS = {
  font: 'fridge:settings:font',
}
