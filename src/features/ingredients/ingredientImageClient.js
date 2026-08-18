import { getAuthHeader } from '../../lib/supabaseClient'

// 이름별 생성 이미지 URL을 메모리에 캐싱해서, 같은 세션에서 같은 이름의
// 카드가 여러 번 렌더링되어도 /api/ingredient-image를 중복 호출하지 않는다.
// (실제 캐싱의 근거는 서버 쪽 ingredient_images 테이블이며, 이건 그 위에 얹은
// 세션 내 중복 요청 방지용 얕은 캐시일 뿐이다.)
const urlCache = new Map()
const inflightRequests = new Map()

async function fetchIngredientImageUrl(name, { force = false } = {}) {
  const res = await fetch('/api/ingredient-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ name, force }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || '식재료 이미지 생성에 실패했습니다.')
  }

  return data.imageUrl
}

export function getIngredientImageUrl(name) {
  if (urlCache.has(name)) return Promise.resolve(urlCache.get(name))
  if (inflightRequests.has(name)) return inflightRequests.get(name)

  const promise = fetchIngredientImageUrl(name)
    .then((url) => {
      urlCache.set(name, url)
      inflightRequests.delete(name)
      return url
    })
    .catch((err) => {
      inflightRequests.delete(name)
      throw err
    })

  inflightRequests.set(name, promise)
  return promise
}

// "이미지 다시 생성" 버튼에서 호출. 캐시를 무시하고 서버에 새로 생성을
// 요청한 뒤, 얕은 캐시도 새 URL로 덮어써서 이후 재렌더링에도 반영되게 한다.
export async function regenerateIngredientImageUrl(name) {
  const url = await fetchIngredientImageUrl(name, { force: true })
  urlCache.set(name, url)
  return url
}
