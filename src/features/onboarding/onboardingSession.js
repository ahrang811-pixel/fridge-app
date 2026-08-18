const SEEN_KEY = 'fridge:onboardingSeen'

// 이 기기에서 한 번이라도 튜토리얼을 본 적이 있으면 localStorage에 영구히
// 기록한다. 로그인/로그아웃/새로고침/앱 재실행 등 어떤 경우에도 다시 지우지
// 않으므로, 가입 직후 최초 1회만 뜨고 그 이후로는 절대 다시 뜨지 않는다.
export function hasSeenOnboarding() {
  return window.localStorage.getItem(SEEN_KEY) === 'true'
}

export function markOnboardingSeen() {
  window.localStorage.setItem(SEEN_KEY, 'true')
}
