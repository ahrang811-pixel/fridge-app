// Naver Clova OCR General 서버 호출 로직.
// CLOVA_OCR_SECRET은 여기서만 사용되며(서버 사이드), VITE_ 접두사가 없으므로
// 브라우저로 전달되는 빌드 결과물에는 절대 포함되지 않는다.
export async function callClovaOcr({ imageBase64, format = 'jpg' }) {
  const invokeUrl = process.env.CLOVA_OCR_INVOKE_URL
  const secret = process.env.CLOVA_OCR_SECRET

  if (!invokeUrl || !secret) {
    const err = new Error(
      'Clova OCR 환경변수가 설정되지 않았습니다 (CLOVA_OCR_INVOKE_URL, CLOVA_OCR_SECRET).',
    )
    err.status = 500
    throw err
  }

  if (!imageBase64) {
    const err = new Error('imageBase64가 필요합니다.')
    err.status = 400
    throw err
  }

  const body = {
    version: 'V2',
    requestId: crypto.randomUUID(),
    timestamp: Date.now(),
    lang: 'ko',
    images: [{ format, name: 'receipt', data: imageBase64 }],
  }

  const response = await fetch(invokeUrl, {
    method: 'POST',
    headers: {
      'X-OCR-SECRET': secret,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const err = new Error(data?.message || 'Clova OCR 요청이 실패했습니다.')
    err.status = response.status
    throw err
  }

  return data
}
