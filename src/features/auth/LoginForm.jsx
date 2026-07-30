import { useState } from 'react'
import { supabase, setRememberMe } from '../../lib/supabaseClient'

function initialRememberMe() {
  return window.localStorage.getItem('fridge:rememberMe') !== 'false'
}

export function LoginForm() {
  const [mode, setMode] = useState('signin') // signin | signup | forgot
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMeChecked] = useState(initialRememberMe)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const resetMessages = () => {
    setError('')
    setNotice('')
  }

  const switchMode = (next) => {
    setMode(next)
    setConfirmPassword('')
    resetMessages()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    resetMessages()

    if (mode === 'signup' && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    setRememberMe(rememberMe)

    const { error: authError } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (mode === 'signup') {
      setNotice('가입이 완료되었습니다. 이메일 확인이 필요할 수 있어요.')
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    resetMessages()
    setLoading(true)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: window.location.origin },
    )

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setNotice('비밀번호 재설정 링크를 이메일로 보냈어요. 메일함을 확인해주세요.')
  }

  if (mode === 'forgot') {
    return (
      <div className="app-bg flex min-h-svh items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-center text-lg font-semibold text-gray-900">
            🧊 비밀번호 재설정
          </h1>
          <p className="mb-6 text-center text-sm text-gray-400">
            가입한 이메일로 재설정 링크를 보내드려요
          </p>

          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
            {notice && <p className="text-xs text-emerald-600">{notice}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? '보내는 중…' : '재설정 이메일 보내기'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => switchMode('signin')}
            className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-bg flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <a
          href="/"
          className="mb-3 inline-block text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          ← 소개 페이지로
        </a>
        <h1 className="mb-1 text-center text-lg font-semibold text-gray-900">
          🧊 공유 냉장고
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          {mode === 'signin'
            ? '로그인하고 시작하세요'
            : '새 계정을 만들어보세요'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 (6자 이상)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          {mode === 'signup' && (
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          )}

          {mode === 'signin' && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-gray-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMeChecked(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                자동 로그인
              </label>
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-gray-400 hover:text-gray-600"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
          {notice && <p className="text-xs text-emerald-600">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? '처리 중…' : mode === 'signin' ? '로그인' : '회원가입'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
          className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          {mode === 'signin'
            ? '계정이 없나요? 회원가입'
            : '이미 계정이 있나요? 로그인'}
        </button>

        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          개인정보처리방침
        </a>
      </div>
    </div>
  )
}
