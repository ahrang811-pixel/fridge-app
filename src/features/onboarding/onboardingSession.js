const SEEN_KEY = 'fridge:onboardingSeen'

// sessionStorage는 탭 단위로 유지되고 탭을 닫으면 사라진다.
// 로그인 세션 동안(새로고침해도) 한 번만 보여주고, 로그아웃하면
// 다음 로그인 때 다시 보여주기 위해 명시적으로 지운다.
export function hasSeenOnboarding() {
  return window.sessionStorage.getItem(SEEN_KEY) === 'true'
}

export function markOnboardingSeen() {
  window.sessionStorage.setItem(SEEN_KEY, 'true')
}

export function clearOnboardingSeen() {
  window.sessionStorage.removeItem(SEEN_KEY)
}
