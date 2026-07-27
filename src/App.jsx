import { AppShell } from './AppShell'
import { useAuth } from './features/auth/AuthContext'
import { LoginForm } from './features/auth/LoginForm'
import { ResetPasswordForm } from './features/auth/ResetPasswordForm'
import { PrivacyPolicy } from './features/legal/PrivacyPolicy'
import { SpaceProvider } from './features/space/SpaceContext'

function App() {
  const { loading, session, passwordRecovery, completePasswordRecovery } =
    useAuth()

  // 로그인 여부와 관계없이 누구나 볼 수 있어야 하는 정적 페이지라
  // 인증 상태를 기다리지 않고 가장 먼저 처리한다.
  if (window.location.pathname === '/privacy') {
    return <PrivacyPolicy />
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
