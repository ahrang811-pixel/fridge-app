import {
  extractVideoId,
  fetchVideoSnippet,
  fetchTopComments,
  partitionComments,
} from './_lib/youtube.js'
import { extractRecipeFromVideo } from './_lib/geminiRecipeExtract.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const { url, categories } = req.body ?? {}
    const videoId = extractVideoId(url)
    if (!videoId) {
      res.status(400).json({
        message: '유효한 유튜브 링크가 아닙니다. 링크를 다시 확인해주세요.',
      })
      return
    }

    const safeCategories =
      Array.isArray(categories) && categories.length ? categories : ['기타']

    const { title, description, channelId } = await fetchVideoSnippet(videoId)
    const comments = await fetchTopComments(videoId)
    const { authorComments, topComments } = partitionComments(comments, channelId)

    const extracted = await extractRecipeFromVideo({
      title,
      description,
      authorComments,
      topComments,
      categories: safeCategories,
    })

    res.status(200).json({ videoId, title, ...extracted })
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || '유튜브 레시피 분석 중 오류가 발생했습니다.',
    })
  }
}
