import { callGemini, normalizeCategory } from './gemini.js'

function buildPrompt(title, description, categories) {
  return [
    '아래는 유튜브 요리 영상의 제목과 설명란 텍스트야.',
    '설명란에 재료 목록이나 조리법(레시피) 정보가 실제로 들어있는지 판단해줘.',
    '해시태그, 채널 홍보, 다른 영상 링크, 타임스탬프만 있고 재료/조리법이 없으면',
    '없는 것으로 판단해줘 (found: false).',
    '',
    `제목: ${title}`,
    '설명란:',
    description || '(설명란 없음)',
    '',
    '레시피 정보가 있으면 found를 true로 하고 다음을 채워줘:',
    '- name: 요리 이름',
    `- category: 반드시 다음 중 하나로: ${categories.join(', ')}`,
    '- ingredients: 재료 목록 (배열, 각 항목은 "이름 수량" 형태로 간결하게)',
    '- instructions: 조리 순서 (배열, 각 항목은 한 단계)',
    '설명란 원문에 있는 내용만 사용하고, 없는 재료나 단계를 지어내지 마.',
    '모든 응답은 한국어로 작성해줘.',
  ].join('\n')
}

// 유튜브 영상 제목/설명란에서 레시피 정보를 뽑아낸다.
// 반환값: { found: false } 또는
//         { found: true, name, category, ingredients: string[], instructions: string[] }
export async function extractRecipeFromVideo({ title, description, categories }) {
  const parsed = await callGemini({
    prompt: buildPrompt(title, description, categories),
    schema: {
      type: 'OBJECT',
      properties: {
        found: { type: 'BOOLEAN' },
        name: { type: 'STRING' },
        category: { type: 'STRING' },
        ingredients: { type: 'ARRAY', items: { type: 'STRING' } },
        instructions: { type: 'ARRAY', items: { type: 'STRING' } },
      },
      required: ['found'],
    },
  })

  if (!parsed?.found) {
    return { found: false }
  }

  return {
    found: true,
    name: typeof parsed.name === 'string' ? parsed.name : '',
    category: normalizeCategory(parsed.category, categories),
    ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
    instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
  }
}
