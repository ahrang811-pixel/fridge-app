import { useState } from 'react'

const SOURCE_LABELS = {
  description: '설명란',
  author_comment: '작성자 댓글',
  top_comment: '인기 댓글',
}

export function YoutubeRecipeReviewModal({
  videoId,
  title,
  found,
  source,
  categories,
  initialName,
  initialCategory,
  initialIngredients,
  initialInstructions,
  saving,
  onSave,
  onCancel,
}) {
  const [name, setName] = useState(initialName)
  const [category, setCategory] = useState(initialCategory)
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [instructions, setInstructions] = useState(initialInstructions)

  const canSave = name.trim().length > 0 && !saving

  const handleSave = () => {
    if (!canSave) return
    onSave({
      name: name.trim(),
      category,
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      youtube_video_id: videoId,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">유튜브에서 레시피 가져오기</h2>
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            닫기
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title || '유튜브 영상'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {found ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              💡 {SOURCE_LABELS[source] ?? '설명란/댓글'}에서 레시피 정보를 찾았어요. 확인하고 필요하면 수정해주세요.
            </p>
          ) : (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              📋 설명란과 댓글에 레시피 정보가 없어요. 영상은 저장하고, 재료/조리법은 직접 입력해주세요.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <div className="min-w-[140px] flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                요리 이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김치찌개"
                disabled={saving}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>
            <div className="w-36">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={saving}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              재료 (한 줄에 하나씩)
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={'예: 김치 1/2포기\n돼지고기 200g\n두부 1모'}
              rows={4}
              disabled={saving}
              className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              조리법
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={'예: 1. 김치를 볶는다\n2. 물을 붓고 끓인다\n3. 두부와 고기를 넣는다'}
              rows={5}
              disabled={saving}
              className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? '저장하는 중…' : '레시피 탭에 저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
