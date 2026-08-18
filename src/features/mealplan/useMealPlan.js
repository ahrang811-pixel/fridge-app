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
      .select('date, meal_type, menu, video_type, video_ref')
      .eq('space_id', spaceId)

    if (!error) {
      const next = {}
      for (const row of data ?? []) {
        next[row.date] = {
          ...(next[row.date] ?? {}),
          [row.meal_type]: {
            menu: row.menu,
            videoType: row.video_type,
            videoRef: row.video_ref,
          },
        }
      }
      setMealsByDate(next)
    }
    setLoading(false)
  }, [spaceId])

  useEffect(() => {
    refetch()
  }, [refetch])

  // patch: { menu?, videoType?, videoRef? } - 현재 값에 병합해서 저장한다.
  const updateMeal = async (dateKey, mealType, patch) => {
    const current = mealsByDate[dateKey]?.[mealType] ?? {
      menu: '',
      videoType: null,
      videoRef: null,
    }
    const next = { ...current, ...patch }

    setMealsByDate((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] ?? {}), [mealType]: next },
    }))

    return supabase.from('meal_plans').upsert(
      {
        space_id: spaceId,
        date: dateKey,
        meal_type: mealType,
        menu: next.menu,
        video_type: next.videoType,
        video_ref: next.videoRef,
      },
      { onConflict: 'space_id,date,meal_type' },
    )
  }

  return { mealsByDate, loading, updateMeal }
}
