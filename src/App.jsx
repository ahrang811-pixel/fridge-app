import { useEffect, useState } from 'react'
import { AppShell } from './AppShell'
import { useAuth } from './features/auth/AuthContext'
import { LoginForm } from './features/auth/LoginForm'
import { ResetPasswordForm } from './features/auth/ResetPasswordForm'
import { LandingPage } from './features/landing/LandingPage'
import { PrivacyPolicy } from './features/legal/PrivacyPolicy'
import { SpaceProvider } from './features/space/SpaceContext'

// 비밀번호 재설정 링크는 이 origin("/")으로 돌아오면서 URL 해시에
// type=recovery 토큰을 담아온다. Supabase가 세션에 반영하기 전에도
// 이 시점에 곧바로 판별할 수 있어야 소개 페이지로 잘못 튕기지 않는다.
function hasRecoveryToken() {
  return window.location.hash.includes('type=recovery')
}

function App() {
  const { loading, session, passwordRecovery, completePasswordRecovery } =
    useAuth()
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const goToApp = () => {
    window.history.pushState({}, '', '/app')
    setPath('/app')
  }

  // 로그인 여부와 관계없이 누구나 볼 수 있어야 하는 정적 페이지라
  // 인증 상태를 기다리지 않고 가장 먼저 처리한다.
  if (path === '/privacy') {
    return <PrivacyPolicy />
  }

  if (path === '/' && !passwordRecovery && !hasRecoveryToken()) {
    return <LandingPage isLoggedIn={!!session} onEnter={goToApp} />
  }

  if (loading) {
    return (
      <div className="app-bg flex min-h-svh items-center justify-center text-sm text-gray-400">
        불러오는 중…
      </div>
    )
  }

  if (passwordRecovery) {
    return <ResetPasswordForm onDone={completePasswordRecovery} />
  }

  if (!session) return <LoginForm />

  return (
    <SpaceProvider>
      <AppShell />
    </SpaceProvider>
  )
}

export default App
