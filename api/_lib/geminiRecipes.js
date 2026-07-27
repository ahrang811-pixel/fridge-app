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
                // category에 responseSchema enum 제약을 걸면(한글 문자열 enum) Vercel
                // 배포 환경에서 실제로 매번 깨진 값("ѽ" 등)이 돌아오는 문제가 있었다
                // (로컬에서 직접 호출하면 재현되지 않아 리전/인프라에 따른 제약 디코딩
                // 문제로 보임). enum 없이 자유 텍스트로 받고 아래에서 직접 검증한다.
                name: { type: 'STRING' },
                category: { type: 'STRING' },
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

  const recipes = Array.isArray(parsed?.recipes) ? parsed.recipes : []
  // TEMP DIAGNOSTIC - pinpoint where the category value gets corrupted.
  if (recipes[0]) {
    const raw = recipes[0].category
    console.error(
      '[category-diagnostic] raw=%s codePoints=%s textContentType=%s',
      JSON.stringify(raw),
      typeof raw === 'string'
        ? [...raw].map((c) => 'U+' + c.codePointAt(0).toString(16)).join(',')
        : 'n/a',
      response.headers.get('content-type'),
    )
  }
  return recipes.map((recipe) => ({
    ...recipe,
    category: normalizeCategory(recipe.category, categories),
  }))
}

// enum 없이 받은 category가 요청한 목록과 정확히 일치하지 않을 수 있으니
// (대소문자/공백 차이, 혹은 깨진 값) 여기서 매칭해서 항상 유효한 값으로 맞춘다.
function normalizeCategory(rawCategory, categories) {
  const trimmed = typeof rawCategory === 'string' ? rawCategory.trim() : ''
  const exact = categories.find((c) => c === trimmed)
  if (exact) return exact

  const looseMatch = categories.find(
    (c) => c.replace(/\s/g, '') === trimmed.replace(/\s/g, ''),
  )
  if (looseMatch) return looseMatch

  return categories[0] ?? '기타'
}
