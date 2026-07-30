import { useEffect, useState } from 'react'
import { getIngredientImageUrl } from './ingredientImageClient'

// 식재료 이름에 맞는 AI 생성 이미지를 요청한다. 생성 전/실패 시에는 null을
// 반환하므로, 호출하는 쪽에서 카테고리 기본 아이콘으로 대체해서 보여주면 된다.
export function useIngredientImage(name) {
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    setImageUrl(null)

    if (!name) return undefined

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
  }, [name])

  return imageUrl
}
