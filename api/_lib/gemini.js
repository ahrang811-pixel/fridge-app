// Google Gemini API 호출을 위한 공용 저수준 클라이언트.
// GEMINI_API_KEY는 여기서만 사용되며(서버 사이드), VITE_ 접두사가 없으므로
// 브라우저로 전달되는 빌드 결과물에는 절대 포함되지 않는다.
// 버전 고정 모델명 대신 alias를 쓴다 - Google이 alias가 가리키는 실제 모델을
// 계속 최신 안정 버전으로 옮겨주므로, 특정 버전이 단종돼도 코드 수정 없이 동작한다.
const MODEL = 'gemini-flash-latest'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

// prompt(문자열)를 보내고 responseSchema에 맞는 JSON을 파싱해서 돌려준다.
export async function callGemini({ prompt, schema }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    const err = new Error(
      'Gemini API 환경변수가 설정되지 않았습니다 (GEMINI_API_KEY).',
    )
    err.status = 500
    throw err
  }

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const err = new Error(data?.error?.message || 'Gemini API 요청이 실패했습니다.')
    err.status = response.status
    throw err
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    const err = new Error('Gemini 응답에서 텍스트를 찾지 못했습니다.')
    err.status = 502
    throw err
  }

  try {
    return JSON.parse(text)
  } catch {
    const err = new Error('Gemini 응답을 JSON으로 해석하지 못했습니다.')
    err.status = 502
    throw err
  }
}

// category가 요청한 목록과 정확히 일치하지 않을 수 있으니(대소문자/공백 차이 등)
// 여기서 매칭해서 항상 유효한 값으로 맞춘다.
export function normalizeCategory(rawCategory, categories) {
  const trimmed = typeof rawCategory === 'string' ? rawCategory.trim() : ''
  const exact = categories.find((c) => c === trimmed)
  if (exact) return exact

  const looseMatch = categories.find(
    (c) => c.replace(/\s/g, '') === trimmed.replace(/\s/g, ''),
  )
  if (looseMatch) return looseMatch

  return categories[0] ?? '기타'
}
