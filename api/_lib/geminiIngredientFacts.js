import { callGemini } from './gemini.js'

function buildPrompt(name, category) {
  return [
    `"${name}"(카테고리: ${category}) 식재료에 대한 정보를 알려줘.`,
    'storageMethods: 이 식재료를 보관할 수 있는 서로 다른 방식들(예: 냉장 보관, 냉동 보관, 실온 보관 중 실제로 의미 있는 방식만) 목록. 최소 1개, 가능하면 2개 이상.',
    '각 방식마다 다음을 채워줘 - method: 방식 이름(예: "냉장 보관", "썰어서 소분 후 냉동 보관"). ',
    'period: 그 방식으로 보관했을 때 권장 소비기간을 사람이 읽기 쉬운 짧은 표현으로(예: "5일", "1개월", "2~3주"). ',
    'tips: 실제 살림 노하우 수준의 구체적인 보관 방법. 해당되는 경우 (1) 어떤 자세로 두면 좋은지(예: 세워서 보관), (2) 어떤 용기나 포장을 쓰면 좋은지(예: 밀폐용기, 키친타월로 감싸기, 지퍼백), (3) 그 밖에 신선도를 오래 유지하는 팁을 한두 문장으로 자연스럽게 녹여서 설명.',
    'maxStorageDays: 위 storageMethods 중 가장 오래 보관할 수 있는 방식 기준 최대 일수(정수).',
    'buyingTip: 마트나 시장에서 신선하고 좋은 것을 고르는 구매 요령을 한두 문장으로.',
    '모든 응답은 한국어로 작성해줘.',
  ].join(' ')
}

// 식재료 이름의 보관 방식별 안내("storageMethods"), "최대 보관기한", "구입 시 꿀팁"을
// Gemini로 생성한다. 결과는 호출하는 쪽(ingredientFactsService.js)에서
// ingredient_ai_facts 테이블에 캐싱한다.
export async function generateIngredientFacts(name, category) {
  const parsed = await callGemini({
    prompt: buildPrompt(name, category),
    schema: {
      type: 'OBJECT',
      properties: {
        storageMethods: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              method: { type: 'STRING' },
              period: { type: 'STRING' },
              tips: { type: 'STRING' },
            },
            required: ['method', 'period', 'tips'],
          },
        },
        maxStorageDays: { type: 'INTEGER' },
        buyingTip: { type: 'STRING' },
      },
      required: ['storageMethods', 'maxStorageDays', 'buyingTip'],
    },
  })

  const storageMethods = Array.isArray(parsed?.storageMethods)
    ? parsed.storageMethods
        .filter((m) => m?.method && m?.period && m?.tips)
        .map((m) => ({ method: m.method, period: m.period, tips: m.tips }))
    : []

  return {
    storageMethods,
    maxStorageDays: Number.isFinite(parsed?.maxStorageDays) ? parsed.maxStorageDays : null,
    buyingTip: typeof parsed?.buyingTip === 'string' ? parsed.buyingTip : '',
  }
}
