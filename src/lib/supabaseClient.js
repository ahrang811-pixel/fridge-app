import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const REMEMBER_ME_KEY = 'fridge:rememberMe'

function isRemembered() {
  return window.localStorage.getItem(REMEMBER_ME_KEY) !== 'false'
}

function clearAuthTokens(storage) {
  Object.keys(storage)
    .filter((key) => key.startsWith('sb-') && key.endsWith('-auth-token'))
    .forEach((key) => storage.removeItem(key))
}

// 로그인 화면의 "자동 로그인" 체크 여부에 따라 세션을 localStorage(브라우저를
// 껐다 켜도 유지)와 sessionStorage(탭을 닫으면 사라짐) 중 어디에 저장할지 정한다.
export function setRememberMe(remember) {
  window.localStorage.setItem(REMEMBER_ME_KEY, String(remember))
  clearAuthTokens(remember ? window.sessionStorage : window.localStorage)
}

const authStorage = {
  getItem: (key) =>
    (isRemembered() ? window.localStorage : window.sessionStorage).getItem(
      key,
    ),
  setItem: (key, value) =>
    (isRemembered() ? window.localStorage : window.sessionStorage).setItem(
      key,
      value,
    ),
  removeItem: (key) => {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: authStorage },
})

// 서버리스 함수(api/*.js)가 요청자를 식별해야 할 때(예: 하루 사용 한도 체크)
// 붙이는 Authorization 헤더. 로그인 상태가 아니면 빈 객체를 반환한다.
export async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {}
}
