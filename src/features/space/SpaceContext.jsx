import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useAuth } from '../auth/AuthContext'

const SpaceContext = createContext(null)

const ACTIVE_SPACE_KEY = 'fridge:activeSpaceId'

export function SpaceProvider({ children }) {
  const { user } = useAuth()
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSpaceId, setActiveSpaceId] = useLocalStorage(
    ACTIVE_SPACE_KEY,
    null,
  )
  const [error, setError] = useState('')

  const refetchSpaces = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('spaces')
      .select('id, name, invite_code, invite_code_expires_at, created_at')
      .order('created_at', { ascending: true })
    if (!fetchError) setSpaces(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) refetchSpaces()
  }, [user?.id])

  const activeSpace = spaces.find((s) => s.id === activeSpaceId) ?? null

  useEffect(() => {
    if (!loading && !activeSpace && spaces.length === 1) {
      setActiveSpaceId(spaces[0].id)
    }
  }, [loading, spaces, activeSpace])

  const createSpace = async (name) => {
    setError('')
    const { data, error: rpcError } = await supabase.rpc('create_space', {
      space_name: name,
    })
    if (rpcError) {
      setError(rpcError.message)
      return { error: rpcError }
    }
    await refetchSpaces()
    setActiveSpaceId(data.id)
    return { data }
  }

  const joinSpace = async (code) => {
    setError('')
    const { data, error: rpcError } = await supabase.rpc('join_space', {
      code,
    })
    if (rpcError) {
      setError(rpcError.message)
      return { error: rpcError }
    }
    await refetchSpaces()
    setActiveSpaceId(data.id)
    return { data }
  }

  const regenerateInviteCode = async (spaceId) => {
    setError('')
    const { data, error: rpcError } = await supabase.rpc(
      'regenerate_invite_code',
      { target_space_id: spaceId },
    )
    if (rpcError) {
      setError(rpcError.message)
      return { error: rpcError }
    }
    await refetchSpaces()
    return { data }
  }

  const renameSpace = async (spaceId, name) => {
    setError('')
    const { data, error: rpcError } = await supabase.rpc('rename_space', {
      target_space_id: spaceId,
      new_name: name,
    })
    if (rpcError) {
      setError(rpcError.message)
      return { error: rpcError }
    }
    await refetchSpaces()
    return { data }
  }

  const value = {
    spaces,
    loading,
    activeSpace,
    setActiveSpaceId,
    createSpace,
    joinSpace,
    regenerateInviteCode,
    renameSpace,
    error,
  }

  return (
    <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
  )
}

export function useSpace() {
  const ctx = useContext(SpaceContext)
  if (!ctx) throw new Error('useSpace must be used within SpaceProvider')
  return ctx
}
