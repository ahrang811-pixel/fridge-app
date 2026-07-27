// YouTube Data API v3 호출 로직.
// YOUTUBE_API_KEY는 여기서만 사용되며(서버 사이드), VITE_ 접두사가 없으므로
// 브라우저로 전달되는 빌드 결과물에는 절대 포함되지 않는다.
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
const YOUTUBE_COMMENT_THREADS_URL =
  'https://www.googleapis.com/youtube/v3/commentThreads'

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

function getApiKey() {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    const err = new Error(
      'YouTube API 환경변수가 설정되지 않았습니다 (YOUTUBE_API_KEY).',
    )
    err.status = 500
    throw err
  }
  return apiKey
}

// 영상 제목/설명란/채널 ID를 가져온다. channelId는 댓글 중 영상 작성자(채널
// 운영자) 본인이 쓴 댓글을 가려내는 데 쓴다.
export async function fetchVideoSnippet(videoId) {
  const apiKey = getApiKey()

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
    channelId: item.snippet?.channelId ?? null,
  }
}

// 최상위 댓글을 최대 maxResults개 가져온다. 댓글이 꺼져 있는 영상이면
// (403 commentsDisabled) 에러 대신 빈 배열을 돌려준다 - 설명란만으로도
// 분석은 계속 진행할 수 있어야 하므로.
export async function fetchTopComments(videoId, { maxResults = 50 } = {}) {
  const apiKey = getApiKey()

  const url = new URL(YOUTUBE_COMMENT_THREADS_URL)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('videoId', videoId)
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('order', 'relevance')
  url.searchParams.set('textFormat', 'plainText')
  url.searchParams.set('key', apiKey)

  const response = await fetch(url)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const reason = data?.error?.errors?.[0]?.reason
    if (reason === 'commentsDisabled' || reason === 'videoNotFound') {
      return []
    }
    const err = new Error(data?.error?.message || 'YouTube 댓글 조회에 실패했습니다.')
    err.status = response.status
    throw err
  }

  const items = Array.isArray(data?.items) ? data.items : []
  return items.map((item) => {
    const snippet = item.snippet?.topLevelComment?.snippet ?? {}
    return {
      text: snippet.textDisplay ?? '',
      likeCount: snippet.likeCount ?? 0,
      authorChannelId: snippet.authorChannelId?.value ?? null,
      authorDisplayName: snippet.authorDisplayName ?? '',
    }
  })
}

// 댓글 목록을 (1) 영상 작성자(채널 운영자)가 쓴 댓글과 (2) 좋아요가 많은 댓글로
// 나눈다. relevance 정렬로 가져오면 고정 댓글이 보통 맨 앞에 오지만 API가
// "고정 여부"를 공식적으로 노출하진 않으므로, 채널 ID 일치로 작성자 댓글을
// 가려내는 방식을 쓴다.
export function partitionComments(comments, channelId, { authorLimit = 5, topLimit = 5 } = {}) {
  const authorComments = channelId
    ? comments.filter((c) => c.authorChannelId === channelId).slice(0, authorLimit)
    : []

  const topComments = [...comments]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, topLimit)

  return { authorComments, topComments }
}
