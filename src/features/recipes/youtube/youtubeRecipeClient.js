// /api/youtube-recipe (Vercel 서버리스 함수)로 유튜브 링크를 보내
// 영상 정보 + Gemini가 분석한 레시피 정보를 받는다.
// API 키는 서버 쪽에서만 사용되므로 여기서는 링크와 카테고리 목록만 전송한다.
export async function analyzeYoutubeRecipe({ url, categories }) {
  const res = await fetch('/api/youtube-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, categories }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || '유튜브 레시피 분석에 실패했습니다.')
  }

  return data
}
