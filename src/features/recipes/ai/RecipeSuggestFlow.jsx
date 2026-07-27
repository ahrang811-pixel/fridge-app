import { useState } from 'react'
import { fetchRecipeSuggestions } from './recipeSuggestClient'
import { toRecipeRow } from './recipeSuggestUtils'

// 상태: idle(버튼만) -> loading(추천 요청 중) -> results(추천 목록 표시)
export function RecipeSuggestFlow({ ingredientNames, categories, onSaveRecipe }) {
  const [status, setStatus] = useState('idle')
  const [recipes, setRecipes] = useState([])
  const [error, setError] = useState(null)
  const [savedIndexes, setSavedIndexes] = useState(new Set())

  const hasIngredients = ingredientNames.length > 0

  const handleSuggest = async () => {
    setError(null)
    setStatus('loading')
    try {
      const result = await fetchRecipeSuggestions({ ingredientNames, categories })
      if (result.length === 0) {
        setError('추천할 레시피를 찾지 못했습니다. 잠시 후 다시 시도해보세요.')
        setStatus('idle')
        return
      }
      setRecipes(result)
      setSavedIndexes(new Set())
      setStatus('results')
    } catch (err) {
      setError(err.message || 'AI 레시피 추천 중 오류가 발생했습니다.')
      setStatus('idle')
    }
  }

  const handleClose = () => {
    setStatus('idle')
    setRecipes([])
  }

  const handleSave = async (recipe, index) => {
    await onSaveRecipe(toRecipeRow(recipe, categories))
    setSavedIndexes((prev) => new Set(prev).add(index))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSuggest}
          disabled={status === 'loading' || !hasIngredients}
          className="flex items-center gap-1.5 rounded-md border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🤖 {status === 'loading' ? '추천받는 중…' : '냉장고 재료로 레시피 추천'}
        </button>
        {!hasIngredients && (
          <span className="text-xs text-gray-400">
            식재료 목록에 등록된 재료가 있어야 추천받을 수 있어요.
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {status === 'results' && (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">AI 추천 레시피</h3>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100"
            >
              닫기
            </button>
          </div>

          <ul className="flex flex-col gap-3">
            {recipes.map((recipe, index) => {
              const saved = savedIndexes.has(index)
              return (
                <li
                  key={`${recipe.name}-${index}`}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {recipe.name}
                      {recipe.category && (
                        <span className="ml-2 rounded-full border border-gray-200 px-2 py-0.5 text-[11px] font-normal text-gray-500">
                          {recipe.category}
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      disabled={saved}
                      onClick={() => handleSave(recipe, index)}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saved ? '저장됨 ✓' : '레시피 탭에 저장'}
                    </button>
                  </div>

                  {recipe.ingredients?.length > 0 && (
                    <div className="mt-2">
                      <p className="mb-1 text-xs font-semibold text-gray-500">재료</p>
                      <p className="whitespace-pre-line text-sm text-gray-700">
                        {recipe.ingredients.join('\n')}
                      </p>
                    </div>
                  )}

                  {recipe.instructions?.length > 0 && (
                    <div className="mt-2">
                      <p className="mb-1 text-xs font-semibold text-gray-500">조리법</p>
                      <ol className="list-inside list-decimal text-sm text-gray-700">
                        {recipe.instructions.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
