import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSpaceTable(
  table,
  spaceId,
  { orderBy = 'created_at', ascending = true } = {},
) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!spaceId) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('space_id', spaceId)
      .order(orderBy, { ascending })
    if (!error) setItems(data ?? [])
    setLoading(false)
  }, [table, spaceId, orderBy, ascending])

  useEffect(() => {
    refetch()
  }, [refetch])

  const addItem = async (data) => {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert({ ...data, space_id: spaceId })
      .select()
      .single()
    if (!error) setItems((prev) => [...prev, inserted])
    return { data: inserted, error }
  }

  const updateItem = async (id, patch) => {
    const { data: updated, error } = await supabase
      .from(table)
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (!error) {
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
    }
    return { data: updated, error }
  }

  const deleteItem = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) setItems((prev) => prev.filter((it) => it.id !== id))
    return { error }
  }

  return { items, loading, addItem, updateItem, deleteItem, refetch, setItems }
}
