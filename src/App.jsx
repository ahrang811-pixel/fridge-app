import { AppShell } from './AppShell'
import { useAuth } from './features/auth/AuthContext'
import { LoginForm } from './features/auth/LoginForm'
import { ResetPasswordForm } from './features/auth/ResetPasswordForm'
import { SpaceProvider } from './features/space/SpaceContext'

function App() {
  const { loading, session, passwordRecovery, completePasswordRecovery } =
    useAuth()

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
