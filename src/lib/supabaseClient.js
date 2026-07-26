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
