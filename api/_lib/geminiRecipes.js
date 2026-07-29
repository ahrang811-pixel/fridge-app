import { callGemini, normalizeCategory } from './gemini.js'

function buildPrompt(ingredientNames, categories, urgentIngredientNames) {
  const ingredientList = ingredientNames.length
    ? ingredientNames.join(', ')
    : '(등록된 식재료 없음)'

  const lines = [
    `냉장고에 있는 식재료 목록: ${ingredientList}`,
    '이 재료들을 최대한 활용해서 만들 수 있는 요리를 3~4개 추천해줘.',
  ]

  if (urgentIngredientNames?.length) {
    lines.push(
      `그중 유통기한이 3일 이내로 임박한 재료: ${urgentIngredientNames.join(', ')}`,
      '유통기한이 임박한 재료부터 소진할 수 있도록, 위 임박 재료를 활용하는 레시피를 우선순위로 추천해줘.',
    )
  }

  lines.push(
    '냉장고에 없는 재료가 필요하면 소금, 후추 같은 기본 조미료 정도로 최소화해줘.',
    `category는 반드시 다음 중 하나로 골라줘: ${categories.join(', ')}`,
    '조리법은 순서대로 한 단계씩 나눠서 간단하게 작성해줘.',
    '모든 응답은 한국어로 작성해줘.',
  )

  return lines.join('\n')
}

export async function suggestRecipes({
  ingredientNames,
  categories,
  urgentIngredientNames = [],
}) {
  const parsed = await callGemini({
    prompt: buildPrompt(ingredientNames, categories, urgentIngredientNames),
    schema: {
      type: 'OBJECT',
      properties: {
        recipes: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
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
  })

  const recipes = Array.isArray(parsed?.recipes) ? parsed.recipes : []
  return recipes.map((recipe) => ({
    ...recipe,
    category: normalizeCategory(recipe.category, categories),
  }))
}
