// 쿠팡 파트너스 API 승인(누적 15만원 판매) 이후에는 이 함수만 실제 추적 링크
// 생성 로직으로 교체하면 앱 전체에 반영됩니다.
export function getCoupangSearchUrl(keyword) {
  const query = encodeURIComponent(keyword.trim())
  return `https://www.coupang.com/np/search?q=${query}`
}

export const COUPANG_PARTNERS_DISCLOSURE =
  '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'
