// Google Gemini API 호출 로직.
// GEMINI_API_KEY는 여기서만 사용되며(서버 사이드), VITE_ 접두사가 없으므로
// 브라우저로 전달되는 빌드 결과물에는 절대 포함되지 않는다.
// 버전 고정 모델명 대신 alias를 쓴다 - Google이 alias가 가리키는 실제 모델을
// 계속 최신 안정 버전으로 옮겨주므로, 특정 버전이 단종돼도 코드 수정 없이 동작한다.
const MODEL = 'gemini-flash-latest'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

function buildPrompt(ingredientNames, categories) {
  const ingredientList = ingredientNames.length
    ? ingredientNames.join(', ')
    : '(등록된 식재료 없음)'

  return [
    `냉장고에 있는 식재료 목록: ${ingredientList}`,
    '이 재료들을 최대한 활용해서 만들 수 있는 요리를 3~4개 추천해줘.',
    '냉장고에 없는 재료가 필요하면 소금, 후추 같은 기본 조미료 정도로 최소화해줘.',
    `category는 반드시 다음 중 하나로 골라줘: ${categories.join(', ')}`,
    '조리법은 순서대로 한 단계씩 나눠서 간단하게 작성해줘.',
    '모든 응답은 한국어로 작성해줘.',
  ].join('\n')
}

export async function suggestRecipes({ ingredientNames, categories }) {
  const apiKey = process.env.GEMINI_API_KEY
  // TEMP DIAGNOSTIC - Vercel에 실제로 전달된 GEMINI_API_KEY 값의 접두사/길이만
  // 서버 로그에 남긴다 (응답에는 절대 포함하지 않음). 확인 후 이 블록은 제거한다.
  console.error(
    '[gemini-diagnostic] present=%s length=%d prefix=%s',
    Boolean(apiKey),
    apiKey ? apiKey.length : 0,
    apiKey ? apiKey.slice(0, 10) : '',
  )
  if (!apiKey) {
    const err = new Error(
      'Gemini API 환경변수가 설정되지 않았습니다 (GEMINI_API_KEY).',
    )
    err.status = 500
    throw err
  }

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: buildPrompt(ingredientNames, categories) }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          recipes: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                category: { type: 'STRING', enum: categories },
                ingredients: { type: 'ARRAY', items: { type: 'STRING' } },
                instructions: { type: 'ARRAY', items: { type: 'STRING' } },
              },
              required: ['name', 'ingredients', 'instructions'],
            },
          },
        },
        required: ['recipes'],
      },
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
    const err = new Error('Gemini 응답에서 레시피 텍스트를 찾지 못했습니다.')
    err.status = 502
    throw err
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    const err = new Error('Gemini 응답을 JSON으로 해석하지 못했습니다.')
    err.status = 502
    throw err
  }

  return Array.isArray(parsed?.recipes) ? parsed.recipes : []
}
