import { useState } from 'react'

export function SpaceOnboarding({
  spaces,
  onSelect,
  onCreate,
  onJoin,
  onSignOut,
  error,
}) {
  const [mode, setMode] = useState('create')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setLocalError('')
    setSubmitting(true)
    const { error: err } = await onCreate(trimmed)
    setSubmitting(false)
    if (err) setLocalError(err.message)
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    setLocalError('')
    setSubmitting(true)
    const { error: err } = await onJoin(trimmed)
    setSubmitting(false)
    if (err) setLocalError(err.message)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">
        {spaces.length > 0 && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-gray-500">
              내 스페이스
            </p>
            <div className="flex flex-col gap-1">
              {spaces.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className="rounded-md px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === 'create'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              스페이스 만들기
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === 'join'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              초대 코드로 참여
            </button>
          </div>

          {mode === 'create' ? (
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 우리집 냉장고"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? '생성 중…' : '스페이스 만들기'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="flex flex-col gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="초대 코드 (예: AB12CD)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase tracking-widest focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? '참여 중…' : '참여하기'}
              </button>
            </form>
          )}

          {(localError || error) && (
            <p className="mt-3 text-xs text-red-500">{localError || error}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
