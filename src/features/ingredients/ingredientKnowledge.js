// 자주 쓰는 식재료의 카테고리와 구체적인 보관 팁 모음.
// - category: 이름 입력 시 카테고리 자동 추천에 사용
// - tip: 있으면 상세보기에서 카테고리 기본 안내 대신 이 팁을 보여줌
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
  { name: '버섯', category: '채소', tip: '종이봉투에 넣어 냉장 보관하면 물러지는 걸 늦출 수 있어요.' },
  { name: '토마토', category: '채소' },
  { name: '피망', category: '채소' },
  { name: '가지', category: '채소' },

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
  { name: '키위', category: '과일' },

  // 육류
  { name: '삼겹살', category: '육류', tip: '소분해서 랩으로 밀착 포장한 뒤 냉동하면 오래 보관할 수 있어요.' },
  { name: '닭가슴살', category: '육류', tip: '한 끼 분량씩 소분해 냉동 보관하면 편리해요.' },
  { name: '닭다리', category: '육류' },
  { name: '다진고기', category: '육류', tip: '얇게 펴서 냉동하면 필요한 만큼만 부러뜨려 쓸 수 있어요.' },
  { name: '소고기', category: '육류', tip: '핏물을 제거하고 랩으로 밀착 포장한 뒤 냉동 보관하세요.' },
  { name: '베이컨', category: '육류', tip: '낱장으로 분리해 랩에 싸서 냉동하면 필요한 만큼 꺼내 쓸 수 있어요.' },
  { name: '돼지고기', category: '육류' },

  // 수산물
  { name: '고등어', category: '수산물', tip: '손질 후 한 마리씩 랩에 싸서 냉동 보관하면 오래가요.' },
  { name: '새우', category: '수산물', tip: '손질 후 소분해서 냉동하면 필요한 만큼 꺼내 쓸 수 있어요.' },
  { name: '오징어', category: '수산물', tip: '손질 후 밀폐용기에 담아 냉동 보관하세요.' },
  { name: '조개', category: '수산물', tip: '소금물에 해감한 뒤 밀폐용기에 담아 냉장 보관하고, 최대한 빨리 드세요.' },
  { name: '연어', category: '수산물' },

  // 유제품
  { name: '우유', category: '유제품', tip: '문쪽보다 안쪽 선반에 보관하면 온도 변화가 적어 더 오래가요.' },
  { name: '치즈', category: '유제품', tip: '랩으로 밀착 포장한 뒤 밀폐용기에 넣어 냉장 보관하세요.' },
  { name: '요거트', category: '유제품', tip: '개봉 후에는 최대한 빨리 섭취하는 게 좋아요.' },
  { name: '버터', category: '유제품', tip: '랩으로 감싸 냉장 또는 냉동 보관하면 산패를 늦출 수 있어요.' },
  { name: '계란', category: '유제품' },

  // 곡류/가공식품
  { name: '쌀', category: '곡류/가공식품', tip: '밀폐용기에 담아 서늘하고 건조한 곳에 보관하세요.' },
  { name: '식빵', category: '곡류/가공식품', tip: '냉동 보관하면 곰팡이 없이 오래 두고 먹을 수 있어요.' },
  { name: '두부', category: '곡류/가공식품', tip: '물에 담가 냉장 보관하고, 물을 매일 갈아주면 더 오래가요.' },
  { name: '라면', category: '곡류/가공식품' },

  // 소스/양념
  { name: '고추장', category: '소스/양념', tip: '개봉 후 냉장 보관하면 맛이 오래 유지돼요.' },
  { name: '된장', category: '소스/양념', tip: '표면을 눌러 공기와의 접촉을 줄이면 오래 보관할 수 있어요.' },
  { name: '간장', category: '소스/양념', tip: '실온 보관도 가능하지만 냉장 보관하면 풍미가 더 오래 유지돼요.' },
  { name: '고춧가루', category: '소스/양념' },

  // 냉동식품
  { name: '만두', category: '냉동식품', tip: '서로 붙지 않게 지퍼백에 넣어 냉동 보관하세요.' },
  { name: '아이스크림', category: '냉동식품', tip: '온도 변화가 적은 냉동실 안쪽에 보관하면 오래가요.' },

  // 음료
  { name: '두유', category: '음료', tip: '개봉 후 냉장 보관하고 빨리 섭취하세요.' },
  { name: '주스', category: '음료' },
]

const NAME_MATCH_INDEX = [...KNOWN_INGREDIENTS].sort(
  (a, b) => b.name.length - a.name.length,
)

// 입력 중인 이름과 가장 잘 맞는 항목을 찾는다.
// 정확히 일치 -> 알려진 이름이 입력값을 포함(입력 중) -> 입력값이 알려진 이름을 포함 순으로 시도.
export function findIngredientMatch(rawName) {
  const name = rawName.trim()
  if (!name) return null

  const exact = KNOWN_INGREDIENTS.find((item) => item.name === name)
  if (exact) return exact

  const typingMatch = NAME_MATCH_INDEX.find((item) => item.name.startsWith(name))
  if (typingMatch) return typingMatch

  return NAME_MATCH_INDEX.find((item) => name.includes(item.name)) ?? null
}
