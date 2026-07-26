// 자주 쓰는 식재료의 카테고리와 구체적인 보관 팁 모음.
// - name: 정확히 이 이름으로 입력했을 때 매칭되는 기준값 (예: '소세지'와 '소시지'처럼
//   흔히 같이 쓰이는 표기가 있으면 각각 별도 항목으로 추가한다)
// - category: 이름 입력 시 카테고리 자동 추천에 사용. src/features/settings/defaults.js의
//   DEFAULT_INGREDIENT_CATEGORIES에 있는 이름과 정확히 같아야 한다.
// - tip: 있으면 상세보기에서 카테고리 기본 안내 대신 이 팁을 보여줌 (없어도 되고,
//   없으면 카테고리 기본 정보로 자동 대체된다)
//
// 항목을 더 추가하려면: 아래 해당 카테고리 배열에 { name, category, tip } 객체를
// 추가하면 끝. 카테고리 자동 추천/보관 팁 화면 모두 이 목록 하나만 보고 동작한다.
export const KNOWN_INGREDIENTS = [
  // 채소
  { name: '청양고추', category: '채소', tip: '잘게 썰어서 소분한 뒤 냉동 보관하면 오래 두고 쓸 수 있어요.' },
  { name: '대파', category: '채소', tip: '송송 썰어 소분해 냉동하면 필요할 때 바로 꺼내 쓸 수 있어요.' },
  { name: '마늘', category: '채소', tip: '다져서 소분한 뒤 냉동 보관하면 오래가요.' },
  { name: '양파', category: '채소', tip: '신문지에 싸서 서늘하고 통풍이 잘 되는 곳에 두면 냉장 보관 없이도 오래가요.' },
  { name: '감자', category: '채소', tip: '사과와 함께 보관하면 사과에서 나오는 가스 때문에 싹이 늦게 나요.' },
  { name: '당근', category: '채소', tip: '페이퍼타월로 감싸 비닐팩에 넣어 냉장 보관하면 무르는 걸 늦출 수 있어요.' },
  { name: '오이', category: '채소', tip: '물기를 완전히 제거하고 하나씩 랩으로 싸서 보관하면 오래가요.' },
  { name: '상추', category: '채소', tip: '젖은 키친타월로 감싸 밀폐용기에 넣으면 싱싱함이 오래 유지돼요.' },
  { name: '시금치', category: '채소', tip: '데쳐서 물기를 짠 뒤 소분해 냉동하면 오래 보관할 수 있어요.' },
  { name: '애호박', category: '채소', tip: '자른 단면을 랩으로 감싸면 마르는 걸 막을 수 있어요.' },
  { name: '브로콜리', category: '채소', tip: '살짝 데친 뒤 소분해서 냉동하면 오래 두고 먹을 수 있어요.' },
  { name: '깻잎', category: '채소', tip: '키친타월을 깔고 켜켜이 쌓아 밀폐용기에 넣으면 오래가요.' },
  { name: '무', category: '채소', tip: '신문지로 감싸 냉장 보관하면 수분 손실을 줄일 수 있어요.' },
  { name: '배추', category: '채소', tip: '겉잎으로 감싸 신문지에 싸서 냉장 보관하면 오래가요.' },
  { name: '콩나물', category: '채소', tip: '밀폐용기에 물을 자작하게 부어 냉장 보관하면 신선함이 유지돼요.' },
  { name: '숙주', category: '채소', tip: '밀폐용기에 물을 자작하게 부어 냉장 보관하면 신선함이 유지돼요.' },
  { name: '버섯', category: '채소', tip: '종이봉투에 넣어 냉장 보관하면 물러지는 걸 늦출 수 있어요.' },
  { name: '토마토', category: '채소' },
  { name: '방울토마토', category: '채소' },
  { name: '피망', category: '채소' },
  { name: '파프리카', category: '채소' },
  { name: '가지', category: '채소' },
  { name: '양배추', category: '채소', tip: '겉잎을 떼지 말고 랩으로 감싸 냉장 보관하면 오래가요.' },
  { name: '부추', category: '채소' },
  { name: '미나리', category: '채소' },
  { name: '셀러리', category: '채소' },
  { name: '단호박', category: '채소' },
  { name: '고구마', category: '채소', tip: '신문지에 싸서 서늘하고 통풍이 잘 되는 곳에 두면 오래가요 (냉장 보관은 피하세요).' },
  { name: '연근', category: '채소' },
  { name: '우엉', category: '채소' },
  { name: '열무', category: '채소' },
  { name: '얼갈이배추', category: '채소' },
  { name: '청경채', category: '채소' },
  { name: '아스파라거스', category: '채소' },
  { name: '생강', category: '채소', tip: '작게 소분해서 냉동 보관하면 필요한 만큼 꺼내 쓸 수 있어요.' },

  // 과일
  { name: '바나나', category: '과일', tip: '꼭지 부분을 랩으로 감싸면 숙성 속도를 늦출 수 있어요.' },
  { name: '딸기', category: '과일', tip: '씻지 않은 상태로 밀폐용기에 넣어 냉장 보관하고, 먹기 직전에 씻으세요.' },
  { name: '사과', category: '과일', tip: '비닐팩에 넣어 냉장 보관하면 수분 손실을 막을 수 있어요.' },
  { name: '귤', category: '과일', tip: '서늘한 곳에 겹치지 않게 보관하면 무르는 걸 늦출 수 있어요.' },
  { name: '포도', category: '과일', tip: '씻지 않고 밀폐용기에 넣어 냉장 보관하고, 먹기 직전에 씻으세요.' },
  { name: '레몬', category: '과일', tip: '밀폐용기나 지퍼백에 넣어 냉장 보관하면 오래가요.' },
  { name: '아보카도', category: '과일', tip: '덜 익었으면 실온 보관, 다 익었으면 냉장 보관하세요.' },
  { name: '수박', category: '과일' },
  { name: '참외', category: '과일' },
  { name: '키위', category: '과일', tip: '단단하면 실온에서 후숙시키고, 다 익으면 냉장 보관하세요.' },
  { name: '망고', category: '과일', tip: '덜 익었으면 실온 후숙, 다 익으면 냉장 보관하세요.' },
  { name: '파파야', category: '과일', tip: '덜 익었으면 실온 후숙, 다 익으면 냉장 보관하세요.' },
  { name: '자몽', category: '과일' },
  { name: '오렌지', category: '과일' },
  { name: '체리', category: '과일', tip: '씻지 않은 상태로 밀폐용기에 넣어 냉장 보관하고, 먹기 직전에 씻으세요.' },
  { name: '블루베리', category: '과일', tip: '씻지 않은 상태로 밀폐용기에 넣어 냉장 보관하고, 오래 두려면 냉동 보관하세요.' },
  { name: '자두', category: '과일' },
  { name: '복숭아', category: '과일' },
  { name: '배', category: '과일' },
  { name: '멜론', category: '과일' },
  { name: '석류', category: '과일' },
  { name: '무화과', category: '과일' },
  { name: '유자', category: '과일' },
  { name: '한라봉', category: '과일' },

  // 육류
  { name: '삼겹살', category: '육류', tip: '소분해서 랩으로 밀착 포장한 뒤 냉동하면 오래 보관할 수 있어요.' },
  { name: '목살', category: '육류', tip: '소분해서 랩으로 밀착 포장한 뒤 냉동하면 오래 보관할 수 있어요.' },
  { name: '안심', category: '육류', tip: '핏물을 제거하고 랩으로 밀착 포장한 뒤 냉동 보관하세요.' },
  { name: '등심', category: '육류', tip: '핏물을 제거하고 랩으로 밀착 포장한 뒤 냉동 보관하세요.' },
  { name: '갈비', category: '육류', tip: '소분해서 랩으로 밀착 포장한 뒤 냉동하면 오래 보관할 수 있어요.' },
  { name: '닭가슴살', category: '육류', tip: '한 끼 분량씩 소분해 냉동 보관하면 편리해요.' },
  { name: '닭다리', category: '육류' },
  { name: '닭날개', category: '육류' },
  { name: '닭봉', category: '육류' },
  { name: '닭안심', category: '육류' },
  { name: '다진고기', category: '육류', tip: '얇게 펴서 냉동하면 필요한 만큼만 부러뜨려 쓸 수 있어요.' },
  { name: '다짐육', category: '육류', tip: '얇게 펴서 냉동하면 필요한 만큼만 부러뜨려 쓸 수 있어요.' },
  { name: '소고기', category: '육류', tip: '핏물을 제거하고 랩으로 밀착 포장한 뒤 냉동 보관하세요.' },
  { name: '돼지고기', category: '육류' },
  { name: '베이컨', category: '육류', tip: '낱장으로 분리해 랩에 싸서 냉동하면 필요한 만큼 꺼내 쓸 수 있어요.' },
  { name: '소세지', category: '육류', tip: '개봉 후 소분해서 냉동 보관하면 오래 두고 먹을 수 있어요.' },
  { name: '소시지', category: '육류', tip: '개봉 후 소분해서 냉동 보관하면 오래 두고 먹을 수 있어요.' },
  { name: '햄', category: '육류', tip: '개봉 후 밀폐용기에 담아 냉장 보관하세요.' },
  { name: '스팸', category: '육류' },
  { name: '훈제오리', category: '육류' },

  // 수산물
  { name: '고등어', category: '수산물', tip: '손질 후 한 마리씩 랩에 싸서 냉동 보관하면 오래가요.' },
  { name: '갈치', category: '수산물', tip: '손질 후 한 마리씩 랩에 싸서 냉동 보관하면 오래가요.' },
  { name: '삼치', category: '수산물' },
  { name: '참치', category: '수산물' },
  { name: '동태', category: '수산물' },
  { name: '황태', category: '수산물' },
  { name: '멸치', category: '수산물', tip: '밀폐용기에 담아 냉동 보관하면 눅눅해지지 않아요.' },
  { name: '새우', category: '수산물', tip: '손질 후 소분해서 냉동하면 필요한 만큼 꺼내 쓸 수 있어요.' },
  { name: '오징어', category: '수산물', tip: '손질 후 밀폐용기에 담아 냉동 보관하세요.' },
  { name: '문어', category: '수산물' },
  { name: '낙지', category: '수산물' },
  { name: '조개', category: '수산물', tip: '소금물에 해감한 뒤 밀폐용기에 담아 냉장 보관하고, 최대한 빨리 드세요.' },
  { name: '홍합', category: '수산물' },
  { name: '전복', category: '수산물' },
  { name: '굴', category: '수산물', tip: '흐르는 물에 헹구지 말고 밀폐용기에 담아 냉장 보관하고, 최대한 빨리 드세요.' },
  { name: '게', category: '수산물' },
  { name: '연어', category: '수산물' },
  { name: '미역', category: '수산물', tip: '건조 상태로 밀폐용기에 담아 서늘하고 건조한 곳에 보관하세요.' },
  { name: '다시마', category: '수산물', tip: '건조 상태로 밀폐용기에 담아 서늘하고 건조한 곳에 보관하세요.' },
  { name: '김', category: '수산물', tip: '밀폐용기에 담아 습기가 없는 곳에 보관하세요.' },

  // 유제품
  { name: '우유', category: '유제품', tip: '문쪽보다 안쪽 선반에 보관하면 온도 변화가 적어 더 오래가요.' },
  { name: '치즈', category: '유제품', tip: '랩으로 밀착 포장한 뒤 밀폐용기에 넣어 냉장 보관하세요.' },
  { name: '요거트', category: '유제품', tip: '개봉 후에는 최대한 빨리 섭취하는 게 좋아요.' },
  { name: '버터', category: '유제품', tip: '랩으로 감싸 냉장 또는 냉동 보관하면 산패를 늦출 수 있어요.' },
  { name: '계란', category: '유제품' },
  { name: '생크림', category: '유제품', tip: '개봉 후 최대한 빨리 사용하는 게 좋아요.' },
  { name: '크림치즈', category: '유제품' },
  { name: '연유', category: '유제품' },

  // 곡류/가공식품
  { name: '쌀', category: '곡류/가공식품', tip: '밀폐용기에 담아 서늘하고 건조한 곳에 보관하세요.' },
  { name: '식빵', category: '곡류/가공식품', tip: '냉동 보관하면 곰팡이 없이 오래 두고 먹을 수 있어요.' },
  { name: '두부', category: '곡류/가공식품', tip: '물에 담가 냉장 보관하고, 물을 매일 갈아주면 더 오래가요.' },
  { name: '라면', category: '곡류/가공식품' },
  { name: '미숫가루', category: '곡류/가공식품', tip: '밀폐용기에 담아 습기가 없는 곳에 실온 보관하세요.' },
  { name: '밀가루', category: '곡류/가공식품', tip: '밀폐용기에 담아 습기가 없는 곳에 보관하세요 (개봉 후 냉장 보관하면 벌레를 막을 수 있어요).' },
  { name: '빵가루', category: '곡류/가공식품' },
  { name: '국수', category: '곡류/가공식품' },
  { name: '소면', category: '곡류/가공식품' },
  { name: '파스타면', category: '곡류/가공식품' },
  { name: '시리얼', category: '곡류/가공식품' },
  { name: '오트밀', category: '곡류/가공식품' },
  { name: '떡', category: '곡류/가공식품', tip: '소분해서 냉동 보관하면 굳지 않고 오래 두고 먹을 수 있어요.' },
  { name: '즉석밥', category: '곡류/가공식품' },

  // 소스/양념
  { name: '고추장', category: '소스/양념', tip: '개봉 후 냉장 보관하면 맛이 오래 유지돼요.' },
  { name: '된장', category: '소스/양념', tip: '표면을 눌러 공기와의 접촉을 줄이면 오래 보관할 수 있어요.' },
  { name: '간장', category: '소스/양념', tip: '실온 보관도 가능하지만 냉장 보관하면 풍미가 더 오래 유지돼요.' },
  { name: '고춧가루', category: '소스/양념' },
  { name: '소금', category: '소스/양념', tip: '밀폐용기에 담아 습기가 없는 곳에 실온 보관하세요.' },
  { name: '설탕', category: '소스/양념', tip: '밀폐용기에 담아 습기가 없는 곳에 실온 보관하세요.' },
  { name: '식용유', category: '소스/양념', tip: '빛을 피해 서늘한 곳에 실온 보관하세요.' },
  { name: '굴소스', category: '소스/양념', tip: '개봉 후 냉장 보관하면 맛이 오래 유지돼요.' },
  { name: '참기름', category: '소스/양념', tip: '빛을 피해 서늘한 곳에 실온 보관하세요.' },
  { name: '후추', category: '소스/양념' },
  { name: '식초', category: '소스/양념' },
  { name: '맛술', category: '소스/양념' },
  { name: '미림', category: '소스/양념' },
  { name: '청주', category: '소스/양념' },
  { name: '올리고당', category: '소스/양념' },
  { name: '물엿', category: '소스/양념' },
  { name: '케찹', category: '소스/양념' },
  { name: '마요네즈', category: '소스/양념', tip: '개봉 후 냉장 보관하세요.' },
  { name: '머스타드', category: '소스/양념' },
  { name: '카레가루', category: '소스/양념' },
  { name: '다진마늘', category: '소스/양념', tip: '개봉 후 냉장 또는 냉동 보관하세요.' },

  // 냉동식품
  { name: '만두', category: '냉동식품', tip: '서로 붙지 않게 지퍼백에 넣어 냉동 보관하세요.' },
  { name: '아이스크림', category: '냉동식품', tip: '온도 변화가 적은 냉동실 안쪽에 보관하면 오래가요.' },
  { name: '냉동피자', category: '냉동식품' },
  { name: '핫도그', category: '냉동식품' },
  { name: '돈까스', category: '냉동식품' },
  { name: '어묵', category: '냉동식품', tip: '개봉 후 밀폐용기에 담아 냉장 보관하고, 오래 두려면 냉동 보관하세요.' },

  // 음료
  { name: '두유', category: '음료', tip: '개봉 후 냉장 보관하고 빨리 섭취하세요.' },
  { name: '주스', category: '음료' },
  { name: '콜라', category: '음료', tip: '탄산이 빠지지 않게 뚜껑을 꼭 닫아 냉장 보관하세요.' },
  { name: '사이다', category: '음료', tip: '탄산이 빠지지 않게 뚜껑을 꼭 닫아 냉장 보관하세요.' },
  { name: '탄산수', category: '음료' },
  { name: '커피', category: '음료' },
  { name: '원두', category: '음료', tip: '밀폐용기에 담아 서늘하고 건조한 곳에 보관하세요.' },
  { name: '녹차', category: '음료' },
  { name: '홍차', category: '음료' },
  { name: '이온음료', category: '음료' },
  { name: '맥주', category: '음료' },
  { name: '소주', category: '음료' },
  { name: '와인', category: '음료', tip: '눕혀서 서늘하고 어두운 곳에 보관하세요.' },
  { name: '막걸리', category: '음료', tip: '병을 흔들어 섞은 뒤 냉장 보관하고 빨리 드세요.' },
]

// 접두/포함 매칭(아래 typingMatch, containsMatch)은 한 글자짜리 이름(무, 쌀, 귤 등)이
// 엉뚱한 단어 속에서 우연히 겹쳐 잘못 매칭되는 걸 막기 위해 2글자 이상만 대상으로 한다.
// 예: "굴소스"의 "굴" 한 글자가 다른 항목과 겹쳐서 매칭되는 일이 없도록.
const FUZZY_MATCH_INDEX = [...KNOWN_INGREDIENTS]
  .filter((item) => item.name.length >= 2)
  .sort((a, b) => b.name.length - a.name.length)

// 입력 중인 이름과 가장 잘 맞는 항목을 찾는다.
// 정확히 일치 -> 알려진 이름이 입력값으로 시작(입력 중) -> 입력값이 알려진 이름을 포함 순으로 시도.
export function findIngredientMatch(rawName) {
  const name = rawName.trim()
  if (!name) return null

  const exact = KNOWN_INGREDIENTS.find((item) => item.name === name)
  if (exact) return exact

  const typingMatch = FUZZY_MATCH_INDEX.find((item) => item.name.startsWith(name))
  if (typingMatch) return typingMatch

  return FUZZY_MATCH_INDEX.find((item) => name.includes(item.name)) ?? null
}
