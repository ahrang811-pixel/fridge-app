import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export function LoginForm() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    const { error: authError } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (mode === 'signup') {
      setNotice('가입이 완료되었습니다. 이메일 확인이 필요할 수 있어요.')
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))
    setError('')
    setNotice('')
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (6자 이상)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />

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
          onClick={toggleMode}
          className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          {mode === 'signin'
            ? '계정이 없나요? 회원가입'
            : '이미 계정이 있나요? 로그인'}
        </button>
      </div>
    </div>
  )
}
