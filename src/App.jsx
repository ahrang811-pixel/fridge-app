import { useEffect, useState } from 'react'
import { AppShell } from './AppShell'
import { useAuth } from './features/auth/AuthContext'
import { LoginForm } from './features/auth/LoginForm'
import { ResetPasswordForm } from './features/auth/ResetPasswordForm'
import { LandingPage } from './features/landing/LandingPage'
import { PrivacyPolicy } from './features/legal/PrivacyPolicy'
import { SpaceProvider } from './features/space/SpaceContext'

// 비밀번호 재설정/이메일 인증/초대 등 Supabase 인증 링크는 모두 이
// origin("/")으로 돌아오면서 URL 해시에 access_token을 담아온다(type이
// recovery/signup/magiclink 등으로 다름). Supabase가 세션에 반영하기
// 전에도 이 시점에 곧바로 판별할 수 있어야 소개 페이지로 잘못 튕기지
// 않는다. 이 값은 최초 렌더링 시점에 한 번만 읽어서 고정한다 - Supabase
// 클라이언트가 해시를 파싱한 뒤 주소창에서 지워버리기 때문에, 매 렌더마다
// 새로 읽으면 그 사이에 값이 사라져 다시 소개 페이지로 튕길 수 있다.
function hasAuthRedirectHash() {
  return window.location.hash.includes('access_token=')
}

function App() {
  const { loading, session, passwordRecovery, completePasswordRecovery } =
    useAuth()
  const [path, setPath] = useState(() => window.location.pathname)
  const [cameFromAuthRedirect] = useState(hasAuthRedirectHash)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const goToApp = () => {
    window.history.pushState({}, '', '/app')
    setPath('/app')
  }

  // 이메일 인증 등으로 "/"에 세션을 담은 채 돌아왔다면, 주소창을 /app으로
  // 정리해서 새로고침해도 계속 앱에 남아있게 한다(안 그러면 "/"는 소개
  // 페이지 취급이라 다음 방문부터 다시 튕겨나간다).
  useEffect(() => {
    if (path === '/' && cameFromAuthRedirect && !passwordRecovery && session) {
      goToApp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, cameFromAuthRedirect, passwordRecovery, session])

  // 로그인 여부와 관계없이 누구나 볼 수 있어야 하는 정적 페이지라
  // 인증 상태를 기다리지 않고 가장 먼저 처리한다.
  if (path === '/privacy') {
    return <PrivacyPolicy />
  }

  if (path === '/' && !passwordRecovery && !cameFromAuthRedirect) {
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
