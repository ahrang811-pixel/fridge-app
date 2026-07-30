import { getOrCreateIngredientFacts } from './_lib/ingredientFactsService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    const category = typeof req.body?.category === 'string' ? req.body.category : '기타'
    if (!name) {
      res.status(400).json({ message: '식재료 이름이 필요합니다.' })
      return
    }

    const facts = await getOrCreateIngredientFacts(name, category, req)
    res.status(200).json(facts)
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || '식재료 정보 생성 중 오류가 발생했습니다.',
    })
  }
}
