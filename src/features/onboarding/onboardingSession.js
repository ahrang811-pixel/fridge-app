const SEEN_KEY = 'fridge:onboardingSeen'

// iOS PWA(홈 화면 추가)는 앱을 껐다 켤 때 sessionStorage를 초기화해버려서
// sessionStorage 기준으로는 매번 튜토리얼이 다시 떴다. 대신 localStorage에
// 저장해 앱을 껐다 켜도 유지되게 하고, 대신 AuthContext에서 SIGNED_IN /
// SIGNED_OUT 이벤트가 실제로 발생했을 때만 이 플래그를 지워서 "진짜 로그인"
// 시에만 다시 뜨도록 한다.
export function hasSeenOnboarding() {
  return window.localStorage.getItem(SEEN_KEY) === 'true'
}

export function markOnboardingSeen() {
  window.localStorage.setItem(SEEN_KEY, 'true')
}

export function clearOnboardingSeen() {
  window.localStorage.removeItem(SEEN_KEY)
}
