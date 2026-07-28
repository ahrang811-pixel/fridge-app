import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useSpaceMembers } from './useSpaceMembers'

const ROLE_LABELS = {
  owner: 'owner',
  admin: '관리자',
  member: '멤버',
}

export function SpaceMembers({ spaceId, onLeaveSpace }) {
  const { user } = useAuth()
  const {
    members,
    loading,
    error,
    promoteToAdmin,
    demoteToMember,
    removeMember,
  } = useSpaceMembers(spaceId)

  const [leaving, setLeaving] = useState(false)
  const [leaveError, setLeaveError] = useState('')

  const myRole = members.find((m) => m.user_id === user?.id)?.role

  const handleLeave = async () => {
    setLeaveError('')
    setLeaving(true)
    const { error: err } = await onLeaveSpace(spaceId)
    setLeaving(false)
    if (err) setLeaveError(err.message)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-500">멤버 목록</p>

      {loading ? (
        <p className="mt-2 text-xs text-gray-400">불러오는 중…</p>
      ) : (
        <ul className="mt-2 flex flex-col divide-y divide-gray-100">
          {members.map((m) => {
            const isSelf = m.user_id === user?.id
            const canManageRole = myRole === 'owner' && !isSelf && m.role !== 'owner'
            const canRemove =
              !isSelf &&
              m.role !== 'owner' &&
              (myRole === 'owner' || myRole === 'admin')

            return (
              <li
                key={m.user_id}
                className="flex items-center justify-between gap-2 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-900">
                    {m.email}
                    {isSelf && (
                      <span className="ml-1 text-xs text-gray-400">(나)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {ROLE_LABELS[m.role] ?? m.role}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {canManageRole && (
                    <button
                      type="button"
                      onClick={() =>
                        m.role === 'admin'
                          ? demoteToMember(m.user_id)
                          : promoteToAdmin(m.user_id)
                      }
                      className="rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                    >
                      {m.role === 'admin' ? '관리자 해제' : '관리자로 지정'}
                    </button>
                  )}
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => removeMember(m.user_id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      내보내기
                    </button>
                  )}
                  {isSelf && m.role !== 'owner' && (
                    <button
                      type="button"
                      onClick={handleLeave}
                      disabled={leaving}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      {leaving ? '나가는 중…' : '나가기'}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {(error || leaveError) && (
        <p className="mt-2 text-xs text-red-500">{error || leaveError}</p>
      )}
    </div>
  )
}
