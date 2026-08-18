import { useEffect, useState } from 'react'
import { getIngredientImageUrl, regenerateIngredientImageUrl } from './ingredientImageClient'
import { isKnownIngredientName } from './ingredientKnowledge'

// 식재료 이름에 맞는 이미지를 결정한다.
// - ingredientKnowledge.js에 정확히 등록된 이름(isKnown)은 이름/카테고리가
//   이미 확실하므로, AI 이미지를 시도하지 않고 항상 카테고리 아이콘을 쓴다
//   (imageUrl은 늘 null - 호출부는 카테고리 아이콘으로 대체해서 보여주면 된다).
// - 목록에 없는 새 이름만 Pollinations로 생성을 시도한다.
export function useIngredientImage(name) {
  const isKnown = isKnownIngredientName(name || '')
  const [imageUrl, setImageUrl] = useState(null)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    let cancelled = false
    setImageUrl(null)

    if (!name || isKnown) return undefined

    getIngredientImageUrl(name)
      .then((url) => {
        if (!cancelled) setImageUrl(url)
      })
      .catch(() => {
        // 생성 실패 시 조용히 카테고리 기본 아이콘 표시로 대체한다.
      })

    return () => {
      cancelled = true
    }
  }, [name, isKnown])

  const regenerate = async () => {
    if (!name || isKnown || regenerating) return
    setRegenerating(true)
    try {
      const url = await regenerateIngredientImageUrl(name)
      setImageUrl(url)
    } catch {
      // 실패해도 조용히 무시하고 기존 이미지/아이콘을 그대로 유지한다.
    } finally {
      setRegenerating(false)
    }
  }

  return { imageUrl, isKnown, regenerate, regenerating }
}
