import { getAuthHeader } from '../../lib/supabaseClient'

export async function fetchIngredientFacts({ name, category }) {
  const res = await fetch('/api/ingredient-facts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ name, category }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || '식재료 정보를 가져오지 못했습니다.')
  }

  return data
}
