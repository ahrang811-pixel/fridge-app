// 인스타그램은 공개 API 없이 게시물 캡션을 가져올 공식적인 방법이 없다.
// 여기서는 공개 게시물 페이지의 og:description 메타태그를 최선을 다해
// 읽어보되, 인스타그램이 봇 요청을 로그인 페이지로 돌려보내는 등
// 언제든 실패할 수 있다는 전제로 만든다 - 실패 시 예외를 던지지 않고
// null을 돌려줘서 호출하는 쪽이 수동 붙여넣기로 자연스럽게 넘어가게 한다.
const FETCH_TIMEOUT_MS = 8000

const HTML_ENTITIES = {
  '&amp;': '&',
  '&quot;': '"',
  '&#039;': "'",
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>',
}

function decodeHtmlEntities(text) {
  return text.replace(/&amp;|&quot;|&#039;|&apos;|&lt;|&gt;/g, (m) => HTML_ENTITIES[m])
}

export function isInstagramPostUrl(input) {
  const raw = (input ?? '').trim()
  if (!raw) return false

  let url
  try {
    url = new URL(raw)
  } catch {
    return false
  }

  return (
    /(^|\.)instagram\.com$/.test(url.hostname) &&
    /\/(p|reel|reels)\/[^/]+/.test(url.pathname)
  )
}

// 성공하면 { caption, thumbnailUrl }을, 무엇이든 실패하면
// { caption: null, thumbnailUrl: null }을 돌려준다(절대 throw하지 않음).
// 캡션과 썸네일 모두 같은 og 메타태그가 박힌 HTML 한 번으로 얻을 수 있어서
// 요청을 한 번만 보낸다.
export async function fetchInstagramPostMeta(url) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'text/html',
      },
    }).finally(() => clearTimeout(timeout))

    if (!response.ok) return { caption: null, thumbnailUrl: null }

    const html = await response.text()

    const captionMatch = html.match(/<meta property="og:description" content="([^"]*)"/)
    let caption = null
    if (captionMatch) {
      const raw = decodeHtmlEntities(captionMatch[1])
      // og:description은 보통 `12 likes, 3 comments - user on date: "실제 캡션"` 형태라
      // 마지막 큰따옴표 구간만 뽑아낸다. 형태가 다르면 원문 전체를 그대로 쓴다.
      const quoted = raw.match(/:\s*"([\s\S]*)"\s*$/)
      caption = (quoted ? quoted[1] : raw).trim() || null
    }

    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"/)
    const thumbnailUrl = imageMatch ? decodeHtmlEntities(imageMatch[1]).trim() || null : null

    return { caption, thumbnailUrl }
  } catch {
    return { caption: null, thumbnailUrl: null }
  }
}

// 캡션만 필요한 기존 호출부를 위한 얇은 래퍼.
export async function fetchInstagramCaption(url) {
  const { caption } = await fetchInstagramPostMeta(url)
  return caption
}
