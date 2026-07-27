import { fileToOcrPayload } from './imageUtils'

// /api/ocr-receipt (Vercel 서버리스 함수)로 이미지를 보내 Clova OCR 결과를 받는다.
// 시크릿 키는 서버 쪽에서만 사용되므로 여기서는 이미지 데이터만 전송한다.
export async function recognizeReceipt(file) {
  const { imageBase64, format } = await fileToOcrPayload(file)

  const res = await fetch('/api/ocr-receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, format }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || '영수증 인식에 실패했습니다.')
  }

  return data
}
