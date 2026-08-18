import { useState } from 'react'
import { findMatchingRecipeVideo, hasAmbiguousRecipeMatch } from './mealVideoMatch'
import { MealVideoModal } from './MealVideoModal'

export function DayMealEditor({ dateKey, meals, mealTypes, recipes, onUpdateMeal }) {
  const [videoTarget, setVideoTarget] = useState(null) // 현재 영상 모달을 연 끼니 id

  // 메뉴 이름 입력을 마쳤을 때(blur), 아직 영상이 연결되어 있지 않다면
  // 레시피 탭에서 같은/비슷한 이름의 레시피를 찾아 영상을 자동으로 붙여준다.
  // 후보가 정확히 하나면 바로 붙이고, 동명 레시피가 여러 개라 하나로 정할 수
  // 없으면 자동 연결하지 않고 선택 모달을 열어 사용자가 직접 고르게 한다.
  const handleMenuBlur = (mealTypeId, menu) => {
    const current = meals?.[mealTypeId]
    if (current?.videoType) return
    const trimmed = menu.trim()
    if (!trimmed) return

    const match = findMatchingRecipeVideo(recipes, trimmed)
    if (match) {
      onUpdateMeal(dateKey, mealTypeId, match)
      return
    }

    if (hasAmbiguousRecipeMatch(recipes, trimmed)) {
      setVideoTarget(mealTypeId)
    }
  }

  const activeMeal = videoTarget ? (meals?.[videoTarget] ?? null) : null

  return (
    <div className="flex flex-col gap-2">
      {mealTypes.map((mt) => {
        const meal = meals?.[mt.id]
        const hasVideo = !!meal?.videoRef

        return (
          <div key={mt.id} className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-xs font-medium text-gray-400">
              {mt.label}
            </span>
            <input
              type="text"
              value={meal?.menu ?? ''}
              onChange={(e) => onUpdateMeal(dateKey, mt.id, { menu: e.target.value })}
              onBlur={(e) => handleMenuBlur(mt.id, e.target.value)}
              placeholder="메뉴"
              className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setVideoTarget(mt.id)}
              aria-label={hasVideo ? '연결된 영상 보기' : '영상 연결'}
              className={`shrink-0 rounded-md px-1.5 py-1 text-sm transition-colors ${
                hasVideo ? 'text-emerald-600' : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              🎬
            </button>
          </div>
        )
      })}

      {videoTarget && (
        <MealVideoModal
          menuName={activeMeal?.menu ?? ''}
          recipes={recipes}
          current={{
            videoType: activeMeal?.videoType ?? null,
            videoRef: activeMeal?.videoRef ?? null,
          }}
          onAttach={(video) => onUpdateMeal(dateKey, videoTarget, video)}
          onClear={() =>
            onUpdateMeal(dateKey, videoTarget, { videoType: null, videoRef: null })
          }
          onClose={() => setVideoTarget(null)}
        />
      )}
    </div>
  )
}
