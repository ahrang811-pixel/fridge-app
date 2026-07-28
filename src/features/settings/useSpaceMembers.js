import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export function useSpaceMembers(spaceId) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refetch = useCallback(async () => {
    if (!spaceId) {
      setMembers([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: fetchError } = await supabase.rpc(
      'list_space_members',
      { target_space_id: spaceId },
    )
    if (!fetchError) setMembers(data ?? [])
    setLoading(false)
  }, [spaceId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const runAction = async (rpcName, params) => {
    setError('')
    const { error: rpcError } = await supabase.rpc(rpcName, params)
    if (rpcError) {
      setError(rpcError.message)
      return { error: rpcError }
    }
    await refetch()
    return {}
  }

  const promoteToAdmin = (userId) =>
    runAction('set_member_role', {
      target_space_id: spaceId,
      target_user_id: userId,
      new_role: 'admin',
    })

  const demoteToMember = (userId) =>
    runAction('set_member_role', {
      target_space_id: spaceId,
      target_user_id: userId,
      new_role: 'member',
    })

  const removeMember = (userId) =>
    runAction('remove_space_member', {
      target_space_id: spaceId,
      target_user_id: userId,
    })

  return {
    members,
    loading,
    error,
    refetch,
    promoteToAdmin,
    demoteToMember,
    removeMember,
  }
}
