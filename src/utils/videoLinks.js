// 사용자가 붙여넣을 수 있는 여러 유튜브 URL 형태(watch?v=, youtu.be/, shorts/,
// embed/)에서 11자리 영상 ID를 뽑아낸다. URL이 아니라 ID를 직접 붙여넣은
// 경우도 그대로 통과시킨다. api/_lib/youtube.js의 서버용 구현과 동일한 로직이지만,
// 서버 전용 모듈은 클라이언트 번들에 포함할 수 없어 별도로 둔다.
export function extractYoutubeVideoId(input) {
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

function isInstagramUrl(input) {
  try {
    const url = new URL(input.trim())
    return url.hostname.includes('instagram.com')
  } catch {
    return false
  }
}

// 사용자가 붙여넣은 링크를 { videoType, videoRef } 형태로 해석한다.
// 인식하지 못하는 링크면 null.
export function parseVideoUrl(input) {
  const raw = (input ?? '').trim()
  if (!raw) return null

  const youtubeId = extractYoutubeVideoId(raw)
  if (youtubeId) return { videoType: 'youtube', videoRef: youtubeId }

  if (isInstagramUrl(raw)) return { videoType: 'instagram', videoRef: raw }

  return null
}
