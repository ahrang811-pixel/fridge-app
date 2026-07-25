import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export function useMealPlan(spaceId) {
  const [mealsByDate, setMealsByDate] = useState({})
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!spaceId) {
      setMealsByDate({})
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('meal_plans')
      .select('date, meal_type, menu')
      .eq('space_id', spaceId)

    if (!error) {
      const next = {}
      for (const row of data ?? []) {
        next[row.date] = {
          ...(next[row.date] ?? {}),
          [row.meal_type]: row.menu,
        }
      }
      setMealsByDate(next)
    }
    setLoading(false)
  }, [spaceId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const updateMeal = async (dateKey, mealType, value) => {
    setMealsByDate((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] ?? {}), [mealType]: value },
    }))

    return supabase.from('meal_plans').upsert(
      {
        space_id: spaceId,
        date: dateKey,
        meal_type: mealType,
        menu: value,
      },
      { onConflict: 'space_id,date,meal_type' },
    )
  }

  return { mealsByDate, loading, updateMeal }
}
