import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import {
  DEFAULT_INGREDIENT_CATEGORIES,
  DEFAULT_MEAL_TYPES,
  DEFAULT_RECIPE_CATEGORIES,
} from './defaults'

export function useSpaceSettings(spaceId) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!spaceId) {
      setSettings(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('space_settings')
      .select('*')
      .eq('space_id', spaceId)
      .single()
    if (!error) setSettings(data)
    setLoading(false)
  }, [spaceId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const ingredientCategories =
    settings?.ingredient_categories ?? DEFAULT_INGREDIENT_CATEGORIES
  const recipeCategories =
    settings?.recipe_categories ?? DEFAULT_RECIPE_CATEGORIES
  const mealTypes = settings?.meal_types ?? DEFAULT_MEAL_TYPES

  const updateIngredientCategories = async (next) => {
    setSettings((prev) =>
      prev ? { ...prev, ingredient_categories: next } : prev,
    )
    return supabase
      .from('space_settings')
      .update({ ingredient_categories: next })
      .eq('space_id', spaceId)
  }

  const updateRecipeCategories = async (next) => {
    setSettings((prev) =>
      prev ? { ...prev, recipe_categories: next } : prev,
    )
    return supabase
      .from('space_settings')
      .update({ recipe_categories: next })
      .eq('space_id', spaceId)
  }

  const updateMealTypes = async (next) => {
    setSettings((prev) => (prev ? { ...prev, meal_types: next } : prev))
    return supabase
      .from('space_settings')
      .update({ meal_types: next })
      .eq('space_id', spaceId)
  }

  return {
    loading,
    ingredientCategories,
    recipeCategories,
    mealTypes,
    updateIngredientCategories,
    updateRecipeCategories,
    updateMealTypes,
    refetch,
  }
}
