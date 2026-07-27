// YouTube Data API v3 호출 로직.
// YOUTUBE_API_KEY는 여기서만 사용되며(서버 사이드), VITE_ 접두사가 없으므로
// 브라우저로 전달되는 빌드 결과물에는 절대 포함되지 않는다.
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'

// 사용자가 붙여넣을 수 있는 여러 유튜브 URL 형태(watch?v=, youtu.be/, shorts/,
// embed/)에서 11자리 영상 ID를 뽑아낸다. URL이 아니라 ID를 직접 붙여넣은
// 경우도 그대로 통과시킨다.
export function extractVideoId(input) {
  const raw = (input ?? '').trim()
  if (!raw) return null

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw

  let url
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  if (url.hostname.includes('youtu.be')) {
    const id = url.pathname.slice(1).split('/')[0]
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
  }

  if (url.hostname.includes('youtube.com')) {
    if (url.pathname === '/watch') {
      const id = url.searchParams.get('v')
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }
    const match = url.pathname.match(/\/(shorts|embed)\/([a-zA-Z0-9_-]{11})/)
    if (match) return match[2]
  }

  return null
}

// 영상 제목/설명란을 가져온다.
export async function fetchVideoSnippet(videoId) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    const err = new Error(
      'YouTube API 환경변수가 설정되지 않았습니다 (YOUTUBE_API_KEY).',
    )
    err.status = 500
    throw err
  }

  const url = new URL(YOUTUBE_VIDEOS_URL)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('id', videoId)
  url.searchParams.set('key', apiKey)

  const response = await fetch(url)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const err = new Error(data?.error?.message || 'YouTube API 요청이 실패했습니다.')
    err.status = response.status
    throw err
  }

  const item = data?.items?.[0]
  if (!item) {
    const err = new Error('영상을 찾을 수 없습니다. 링크를 다시 확인해주세요.')
    err.status = 404
    throw err
  }

  return {
    title: item.snippet?.title ?? '',
    description: item.snippet?.description ?? '',
  }
}
