// 카테고리별 일반적인 보관방법과 권장 소비기한(구매일 기준 며칠).
// 유통기한을 직접 입력하지 않았을 때 구매일 + 이 값으로 예상 유통기한을 계산한다.
export const CATEGORY_DEFAULTS = {
  채소: {
    storageMethod: '냉장 보관',
    shelfLifeDays: 5,
    note: '구매 후 5일 이내 섭취 권장',
  },
  과일: {
    storageMethod: '냉장 보관',
    shelfLifeDays: 7,
    note: '구매 후 7일 이내 섭취 권장',
  },
  육류: {
    storageMethod: '냉장 보관',
    shelfLifeDays: 3,
    note: '구매 후 2~3일 이내 섭취 권장 (냉동 시 더 길게)',
  },
  수산물: {
    storageMethod: '냉장 보관',
    shelfLifeDays: 2,
    note: '구매 후 1~2일 이내 섭취 권장 (냉동 시 더 길게)',
  },
  유제품: {
    storageMethod: '냉장 보관',
    shelfLifeDays: 7,
    note: '제품 유통기한 확인 권장',
  },
  '곡류/가공식품': {
    storageMethod: '실온 보관',
    shelfLifeDays: 30,
    note: '제품 유통기한 확인 권장',
  },
  '소스/양념': {
    storageMethod: '실온 또는 냉장 보관',
    shelfLifeDays: 90,
    note: '개봉 후 제품 표기 확인 권장',
  },
  냉동식품: {
    storageMethod: '냉동 보관',
    shelfLifeDays: 30,
    note: '제품 유통기한 확인 권장',
  },
  음료: {
    storageMethod: '냉장 보관',
    shelfLifeDays: 7,
    note: '개봉 후 빠른 섭취 권장',
  },
  기타: {
    storageMethod: '냉장 보관',
    shelfLifeDays: 7,
    note: '보관 방법 확인 필요',
  },
}

// 사용자가 직접 추가한 카테고리 등 목록에 없는 경우 사용할 기본값
export const FALLBACK_CATEGORY_DEFAULT = {
  storageMethod: '냉장 보관',
  shelfLifeDays: 7,
  note: '보관 방법 확인 필요',
}

export function getCategoryDefault(category) {
  return CATEGORY_DEFAULTS[category] ?? FALLBACK_CATEGORY_DEFAULT
}
