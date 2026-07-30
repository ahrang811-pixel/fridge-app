import { getOrCreateIngredientImageUrl } from './_lib/ingredientImageService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    if (!name) {
      res.status(400).json({ message: '식재료 이름이 필요합니다.' })
      return
    }

    const imageUrl = await getOrCreateIngredientImageUrl(name, req)
    res.status(200).json({ imageUrl })
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || '식재료 이미지 생성 중 오류가 발생했습니다.',
    })
  }
}
