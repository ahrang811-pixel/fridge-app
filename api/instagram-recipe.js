import { fetchInstagramCaption, isInstagramPostUrl } from './_lib/instagram.js'
import { extractRecipeFromCaption } from './_lib/geminiRecipeExtract.js'
import { enforceDailyLimit } from './_lib/usageLimiter.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const { url, caption, categories } = req.body ?? {}
    const safeCategories =
      Array.isArray(categories) && categories.length ? categories : ['기타']

    let captionText = typeof caption === 'string' ? caption.trim() : ''

    if (!captionText) {
      const trimmedUrl = typeof url === 'string' ? url.trim() : ''
      if (!isInstagramPostUrl(trimmedUrl)) {
        res.status(400).json({
          message: '유효한 인스타그램 게시물 링크가 아닙니다. 링크를 다시 확인해주세요.',
        })
        return
      }

      const fetched = await fetchInstagramCaption(trimmedUrl)
      if (!fetched) {
        res.status(200).json({ fetched: false })
        return
      }
      captionText = fetched
    }

    await enforceDailyLimit(req, 'instagram_recipe')

    const extracted = await extractRecipeFromCaption({
      caption: captionText,
      categories: safeCategories,
    })

    res.status(200).json({ fetched: true, caption: captionText, ...extracted })
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || '인스타그램 레시피 분석 중 오류가 발생했습니다.',
    })
  }
}
