import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { clearOnboardingSeen } from '../onboarding/onboardingSession'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [passwordRecovery, setPasswordRecovery] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true)
        // SIGNED_IN/SIGNED_OUT은 실제 로그인/로그아웃 동작에서만 발생한다.
        // 앱 재실행 시 기존 세션을 복원할 때 발생하는 INITIAL_SESSION 등에서는
        // 온보딩 플래그를 건드리지 않아야 재실행할 때마다 다시 뜨지 않는다.
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          clearOnboardingSeen()
        }
        setSession(newSession)
      },
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading: session === undefined,
    passwordRecovery,
    completePasswordRecovery: () => setPasswordRecovery(false),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
