// 촬영/선택한 영수증 사진을 OCR로 보내기 전에 축소·압축한다.
// 목적: (1) Vercel 서버리스 함수의 요청 본문 크기 제한을 넘지 않도록,
// (2) 업로드 시간을 줄이도록.
const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.85

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'))
    img.src = dataUrl
  })
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'))
    reader.readAsDataURL(file)
  })
}

// { imageBase64, format } 형태로 반환한다 (Clova OCR images[0].data / format).
export async function fileToOcrPayload(file) {
  const dataUrl = await readAsDataUrl(file)
  const img = await loadImage(dataUrl)

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const resizedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  const imageBase64 = resizedDataUrl.split(',')[1]

  return { imageBase64, format: 'jpg' }
}
