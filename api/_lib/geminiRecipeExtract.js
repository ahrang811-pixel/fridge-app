import { callGemini, normalizeCategory } from './gemini.js'

function formatComments(comments, emptyLabel) {
  if (!comments.length) return emptyLabel
  return comments
    .map((c, i) => `${i + 1}. (좋아요 ${c.likeCount}) ${c.text}`)
    .join('\n')
}

function buildPrompt({ title, description, authorComments, topComments, categories }) {
  return [
    '아래는 유튜브 요리 영상의 제목, 설명란, 댓글 일부야.',
    '이 중에 재료 목록이나 조리법(레시피) 정보가 실제로 들어있는지 판단해줘.',
    '해시태그, 채널 홍보, 다른 영상 링크, 타임스탬프, 감사 인사만 있고',
    '재료/조리법이 없으면 없는 것으로 판단해줘 (found: false).',
    '',
    '다음 순서로 우선 확인해: (1) 설명란 (2) 영상 작성자(채널 운영자)가 쓴 댓글',
    '(3) 좋아요가 많은 댓글(시청자가 정리해둔 경우). 여러 곳에 정보가 나뉘어',
    '있으면 종합해서 하나의 레시피로 정리해줘.',
    '',
    `제목: ${title}`,
    '',
    '설명란:',
    description || '(설명란 없음)',
    '',
    '영상 작성자가 쓴 댓글:',
    formatComments(authorComments, '(작성자 댓글 없음)'),
    '',
    '좋아요 많은 댓글:',
    formatComments(topComments, '(댓글 없음)'),
    '',
    '레시피 정보가 있으면 found를 true로 하고 다음을 채워줘:',
    '- name: 요리 이름',
    `- category: 반드시 다음 중 하나로: ${categories.join(', ')}`,
    '- ingredients: 재료 목록 (배열, 각 항목은 "이름 수량" 형태로 간결하게)',
    '- instructions: 조리 순서 (배열, 각 항목은 한 단계)',
    '- source: 레시피 정보를 주로 어디서 찾았는지 ("description", "author_comment", "top_comment" 중 하나)',
    '원문에 있는 내용만 사용하고, 없는 재료나 단계를 지어내지 마.',
    '모든 응답은 한국어로 작성해줘.',
  ].join('\n')
}

// 유튜브 영상 제목/설명란/댓글에서 레시피 정보를 뽑아낸다.
// 반환값: { found: false } 또는
//         { found: true, name, category, ingredients: string[], instructions: string[], source }
export async function extractRecipeFromVideo({
  title,
  description,
  authorComments = [],
  topComments = [],
  categories,
}) {
  const parsed = await callGemini({
    prompt: buildPrompt({ title, description, authorComments, topComments, categories }),
    schema: {
      type: 'OBJECT',
      properties: {
        found: { type: 'BOOLEAN' },
        name: { type: 'STRING' },
        category: { type: 'STRING' },
        ingredients: { type: 'ARRAY', items: { type: 'STRING' } },
        instructions: { type: 'ARRAY', items: { type: 'STRING' } },
        source: { type: 'STRING' },
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
    source: typeof parsed.source === 'string' ? parsed.source : null,
  }
}

function buildCaptionPrompt({ caption, categories }) {
  return [
    '아래는 인스타그램 게시물의 캡션(본문) 글이야.',
    '이 안에 재료 목록이나 조리법(레시피) 정보가 실제로 들어있는지 판단해줘.',
    '해시태그, 계정 홍보, 감사 인사, 다른 게시물 안내만 있고',
    '재료/조리법이 없으면 없는 것으로 판단해줘 (found: false).',
    '',
    '캡션:',
    caption,
    '',
    '레시피 정보가 있으면 found를 true로 하고 다음을 채워줘:',
    '- name: 요리 이름',
    `- category: 반드시 다음 중 하나로: ${categories.join(', ')}`,
    '- ingredients: 재료 목록 (배열, 각 항목은 "이름 수량" 형태로 간결하게)',
    '- instructions: 조리 순서 (배열, 각 항목은 한 단계)',
    '원문에 있는 내용만 사용하고, 없는 재료나 단계를 지어내지 마.',
    '모든 응답은 한국어로 작성해줘.',
  ].join('\n')
}

// 인스타그램 게시물 캡션 텍스트에서 레시피 정보를 뽑아낸다.
// 반환값: { found: false } 또는
//         { found: true, name, category, ingredients: string[], instructions: string[] }
export async function extractRecipeFromCaption({ caption, categories }) {
  const parsed = await callGemini({
    prompt: buildCaptionPrompt({ caption, categories }),
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
