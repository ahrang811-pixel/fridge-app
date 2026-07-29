import { suggestRecipes } from './_lib/geminiRecipes.js'
import { enforceDailyLimit } from './_lib/usageLimiter.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    await enforceDailyLimit(req, 'recipe_suggest')

    const { ingredientNames, categories, urgentIngredientNames } =
      req.body ?? {}
    const recipes = await suggestRecipes({
      ingredientNames: Array.isArray(ingredientNames) ? ingredientNames : [],
      categories:
        Array.isArray(categories) && categories.length ? categories : ['기타'],
      urgentIngredientNames: Array.isArray(urgentIngredientNames)
        ? urgentIngredientNames
        : [],
    })
    res.status(200).json({ recipes })
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'AI 레시피 추천 중 오류가 발생했습니다.',
    })
  }
}
