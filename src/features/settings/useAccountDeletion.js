import { useCallback, useEffect, useState } from 'react'
import { getAuthHeader, supabase } from '../../lib/supabaseClient'
import { useAuth } from '../auth/AuthContext'

export function useAccountDeletion() {
  const { user } = useAuth()
  const [blockers, setBlockers] = useState([])
  const [loadingBlockers, setLoadingBlockers] = useState(true)
  const [membersBySpace, setMembersBySpace] = useState({})
  const [error, setError] = useState('')

  const refetchBlockers = useCallback(async () => {
    setLoadingBlockers(true)
    const { data, error: rpcError } = await supabase.rpc(
      'get_account_deletion_blockers',
    )
    if (!rpcError) setBlockers(data ?? [])
    setLoadingBlockers(false)
    return { data, error: rpcError }
  }, [])

  useEffect(() => {
    refetchBlockers()
  }, [refetchBlockers])

  const loadMembersForSpace = async (spaceId) => {
    const { data, error: rpcError } = await supabase.rpc('list_space_members', {
      target_space_id: spaceId,
    })
    if (!rpcError) {
      setMembersBySpace((prev) => ({ ...prev, [spaceId]: data ?? [] }))
    }
  }

  const transferOwnership = async (spaceId, newOwnerUserId) => {
    setError('')
    const { error: rpcError } = await supabase.rpc('transfer_space_ownership', {
      target_space_id: spaceId,
      new_owner_user_id: newOwnerUserId,
    })
    if (rpcError) {
      setError(rpcError.message)
      return { error: rpcError }
    }
    await refetchBlockers()
    return {}
  }

  const deleteAccount = async (password) => {
    setError('')

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    })
    if (verifyError) {
      const err = new Error('비밀번호가 올바르지 않아요.')
      setError(err.message)
      return { error: err }
    }

    const { error: prepareError } = await supabase.rpc(
      'prepare_account_deletion',
    )
    if (prepareError) {
      setError(prepareError.message)
      return { error: prepareError }
    }

    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
    })
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const err = new Error(data?.message || '회원탈퇴 처리 중 오류가 발생했습니다.')
      setError(err.message)
      return { error: err }
    }

    await supabase.auth.signOut()
    return {}
  }

  return {
    blockers,
    loadingBlockers,
    membersBySpace,
    error,
    loadMembersForSpace,
    transferOwnership,
    deleteAccount,
  }
}
