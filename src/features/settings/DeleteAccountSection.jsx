import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useAccountDeletion } from './useAccountDeletion'

function TransferOwnershipRow({ blocker, membersBySpace, loadMembersForSpace, transferOwnership }) {
  const { user } = useAuth()
  const [selected, setSelected] = useState('')
  const [transferring, setTransferring] = useState(false)
  const members = membersBySpace[blocker.space_id]

  useEffect(() => {
    if (!members) loadMembersForSpace(blocker.space_id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.space_id])

  const candidates = (members ?? []).filter(
    (m) => m.user_id !== user?.id && m.role !== 'owner',
  )

  const handleTransfer = async () => {
    if (!selected) return
    setTransferring(true)
    await transferOwnership(blocker.space_id, selected)
    setTransferring(false)
  }

  return (
    <li className="rounded-lg border border-amber-200 bg-amber-50 p-3">
      <p className="text-sm font-medium text-gray-800">{blocker.space_name}</p>
      <p className="mt-0.5 text-xs text-amber-700">
        다른 멤버 {Number(blocker.member_count) - 1}명이 있어요. owner를 위임해야
        탈퇴할 수 있어요.
      </p>
      {!members ? (
        <p className="mt-2 text-xs text-gray-400">멤버 불러오는 중…</p>
      ) : (
        <div className="mt-2 flex gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="">위임할 멤버 선택</option>
            {candidates.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.email}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selected || transferring}
            onClick={handleTransfer}
            className="shrink-0 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {transferring ? '위임하는 중…' : '위임하기'}
          </button>
        </div>
      )}
    </li>
  )
}

export function DeleteAccountSection() {
  const [expanded, setExpanded] = useState(false)
  const [password, setPassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const {
    blockers,
    loadingBlockers,
    membersBySpace,
    error,
    loadMembersForSpace,
    transferOwnership,
    deleteAccount,
  } = useAccountDeletion()

  const handleDelete = async () => {
    if (!password) return
    setDeleting(true)
    const { error: deleteError } = await deleteAccount(password)
    setDeleting(false)
    if (deleteError) return
    // 성공하면 signOut으로 세션이 사라지고, App이 자동으로 로그인 화면을 보여준다.
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="self-start rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
      >
        회원탈퇴
      </button>
    )
  }

  return (
    <div className="flex max-w-sm flex-col gap-3 rounded-xl border border-red-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">회원탈퇴</p>
      <p className="text-xs leading-relaxed text-gray-500">
        탈퇴하면 계정과 본인이 등록한 데이터가 삭제되며 되돌릴 수 없어요.
      </p>

      {loadingBlockers ? (
        <p className="text-xs text-gray-400">확인하는 중…</p>
      ) : blockers.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {blockers.map((blocker) => (
            <TransferOwnershipRow
              key={blocker.space_id}
              blocker={blocker}
              membersBySpace={membersBySpace}
              loadMembersForSpace={loadMembersForSpace}
              transferOwnership={transferOwnership}
            />
          ))}
        </ul>
      ) : (
        <>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 확인"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setExpanded(false)
                setPassword('')
              }}
              disabled={deleting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!password || deleting}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? '탈퇴 처리 중…' : '탈퇴하기'}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
