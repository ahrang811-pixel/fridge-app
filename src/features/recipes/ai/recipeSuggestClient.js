import { getAuthHeader } from '../../../lib/supabaseClient'

// /api/suggest-recipes (Vercel 서버리스 함수)로 냉장고 식재료 이름과 레시피
// 카테고리 목록을 보내 Gemini가 추천한 레시피 목록을 받는다.
// API 키는 서버 쪽에서만 사용되므로 여기서는 텍스트 데이터만 전송한다.
// Authorization 헤더는 서버가 하루 사용 한도를 체크하는 데 쓰인다.
export async function fetchRecipeSuggestions({
  ingredientNames,
  categories,
  urgentIngredientNames,
}) {
  const res = await fetch('/api/suggest-recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ ingredientNames, categories, urgentIngredientNames }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || 'AI 레시피 추천에 실패했습니다.')
  }

  return Array.isArray(data?.recipes) ? data.recipes : []
}
