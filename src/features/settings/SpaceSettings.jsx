import { useEffect, useState } from 'react'

function formatRemaining(expiresAt) {
  if (!expiresAt) return null
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  if (diffMs <= 0) return '만료됨'
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (hours >= 1) return `${hours}시간 ${minutes}분 후 만료`
  return `${minutes}분 후 만료`
}

export function SpaceSettings({
  spaceId,
  spaceName,
  inviteCode,
  inviteCodeExpiresAt,
  spaces,
  onSwitchSpace,
  onCreateSpace,
  onJoinSpace,
  onRegenerateInviteCode,
  onRenameSpace,
}) {
  const [copied, setCopied] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [mode, setMode] = useState('create')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(spaceName)
  const [renameSubmitting, setRenameSubmitting] = useState(false)
  const [renameError, setRenameError] = useState('')

  const [regenerating, setRegenerating] = useState(false)
  const [regenerateError, setRegenerateError] = useState('')
  const [remaining, setRemaining] = useState(() =>
    formatRemaining(inviteCodeExpiresAt),
  )

  useEffect(() => {
    setRemaining(formatRemaining(inviteCodeExpiresAt))
    const id = setInterval(() => {
      setRemaining(formatRemaining(inviteCodeExpiresAt))
    }, 60000)
    return () => clearInterval(id)
  }, [inviteCodeExpiresAt])

  useEffect(() => {
    if (!editingName) setNameDraft(spaceName)
  }, [spaceName, editingName])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const startEditName = () => {
    setNameDraft(spaceName)
    setRenameError('')
    setEditingName(true)
  }

  const cancelEditName = () => {
    setEditingName(false)
    setNameDraft(spaceName)
    setRenameError('')
  }

  const handleRenameSubmit = async (e) => {
    e.preventDefault()
    const trimmed = nameDraft.trim()
    if (!trimmed || trimmed === spaceName) {
      setEditingName(false)
      return
    }
    setRenameError('')
    setRenameSubmitting(true)
    const { error: err } = await onRenameSpace(spaceId, trimmed)
    setRenameSubmitting(false)
    if (err) {
      setRenameError(err.message)
    } else {
      setEditingName(false)
    }
  }

  const handleRegenerate = async () => {
    setRegenerateError('')
    setRegenerating(true)
    const { error: err } = await onRegenerateInviteCode(spaceId)
    setRegenerating(false)
    if (err) setRegenerateError(err.message)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setError('')
    setSubmitting(true)
    const { error: err } = await onCreateSpace(trimmed)
    setSubmitting(false)
    if (err) {
      setError(err.message)
    } else {
      setName('')
      setShowAdd(false)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    setError('')
    setSubmitting(true)
    const { error: err } = await onJoinSpace(trimmed)
    setSubmitting(false)
    if (err) {
      setError(err.message)
    } else {
      setCode('')
      setShowAdd(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500">현재 스페이스</p>
        {editingName ? (
          <form
            onSubmit={handleRenameSubmit}
            className="mt-1 flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={renameSubmitting}
              className="rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
            >
              저장
            </button>
            <button
              type="button"
              onClick={cancelEditName}
              className="rounded-md px-2 py-1 text-xs font-medium text-gray-400 hover:bg-gray-50"
            >
              취소
            </button>
          </form>
        ) : (
          <div className="mt-1 flex items-center gap-1.5">
            <p className="truncate text-sm font-medium text-gray-900">
              {spaceName}
            </p>
            <button
              type="button"
              onClick={startEditName}
              aria-label="스페이스 이름 수정"
              className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            >
              ✎
            </button>
          </div>
        )}
        {renameError && (
          <p className="mt-1 text-xs text-red-500">{renameError}</p>
        )}

        <p className="mt-4 text-xs font-semibold text-gray-500">초대 코드</p>
        <p className="mb-3 text-xs text-gray-400">
          이 코드를 공유하면 다른 사람이 같은 스페이스에 참여할 수 있어요.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-gray-50 px-3 py-1.5 font-mono text-sm tracking-widest text-gray-900">
            {inviteCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
          >
            {copied ? '복사됨' : '복사'}
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            {regenerating ? '재생성 중…' : '재생성'}
          </button>
        </div>
        {remaining && (
          <p
            className={`mt-1.5 text-xs ${
              remaining === '만료됨' ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {remaining}
          </p>
        )}
        {regenerateError && (
          <p className="mt-1 text-xs text-red-500">{regenerateError}</p>
        )}
      </div>

      {spaces.length > 1 && (
        <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          {spaces.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSwitchSpace(s.id)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                s.id === spaceId
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{s.name}</span>
              {s.id === spaceId && (
                <span className="text-xs font-medium">사용 중</span>
              )}
            </button>
          ))}
        </div>
      )}

      {!showAdd ? (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="self-start text-xs font-medium text-emerald-600 hover:underline"
        >
          + 다른 스페이스 만들기 / 참여하기
        </button>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === 'create'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              만들기
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
              참여하기
            </button>
          </div>

          {mode === 'create' ? (
            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="스페이스 이름"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                추가
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="초대 코드"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm uppercase tracking-widest focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                참여
              </button>
            </form>
          )}

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  )
}
