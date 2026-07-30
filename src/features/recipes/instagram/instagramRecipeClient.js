import { getAuthHeader } from '../../../lib/supabaseClient'

// /api/instagram-recipe (Vercel 서버리스 함수)로 인스타그램 게시물 링크(또는
// 수동으로 붙여넣은 캡션)를 보내 Gemini가 분석한 레시피 정보를 받는다.
// url만 보내면 서버가 먼저 캡션 자동 수집을 시도하고, 실패하면
// { fetched: false }를 돌려준다(에러 아님) - 이때는 caption을 직접 채워서
// 다시 호출하면 그 텍스트로 곧바로 분석한다.
export async function analyzeInstagramRecipe({ url, caption, categories }) {
  const res = await fetch('/api/instagram-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ url, caption, categories }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || '인스타그램 레시피 분석에 실패했습니다.')
  }

  return data
}
