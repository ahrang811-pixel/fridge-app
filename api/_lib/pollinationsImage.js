// API 키 없이 무료로 쓸 수 있는 Pollinations.ai 이미지 생성.
// (Gemini 이미지 모델은 무료 티어 한도가 0이라 결제 계정 연결 없이는 항상
// 429로 실패했기 때문에, 별도 키/결제 없이 쓸 수 있는 이 서비스로 전환했다.)
const BASE_URL = 'https://image.pollinations.ai/prompt'

function buildIngredientImagePrompt(name) {
  return `simple flat illustration of ${name}, white background, minimal, cute`
}

// name(식재료 이름)에 맞는 일러스트를 생성해서 { buffer, mimeType }으로 돌려준다.
export async function generateIngredientImage(name) {
  const prompt = buildIngredientImagePrompt(name)
  const url = `${BASE_URL}/${encodeURIComponent(prompt)}?model=flux&width=512&height=512&nologo=true`

  const response = await fetch(url)

  if (!response.ok) {
    const err = new Error(`Pollinations 이미지 생성 요청이 실패했습니다. (status ${response.status})`)
    err.status = response.status
    throw err
  }

  const arrayBuffer = await response.arrayBuffer()
  const mimeType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'

  return { buffer: Buffer.from(arrayBuffer), mimeType }
}
