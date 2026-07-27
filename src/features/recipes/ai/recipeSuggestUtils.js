// Gemini가 돌려준 레시피({name, category, ingredients:[], instructions:[]})를
// 레시피 탭의 저장 형식(재료/조리법이 줄바꿈으로 구분된 문자열)으로 변환한다.
export function toRecipeRow(recipe, categories) {
  const category = categories.includes(recipe.category)
    ? recipe.category
    : (categories[0] ?? '기타')

  const ingredients = (recipe.ingredients ?? []).join('\n')
  const instructions = (recipe.instructions ?? [])
    .map((step, i) => `${i + 1}. ${step}`)
    .join('\n')

  return {
    name: recipe.name?.trim() ?? '',
    category,
    ingredients,
    instructions,
  }
}
