import { useState } from 'react'

export function RecipeList({ categories, items, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null)

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        등록된 레시피가 없습니다. 위에서 추가해보세요.
      </p>
    )
  }

  const grouped = categories.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ category, items: groupItems }) => (
        <div key={category}>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            {category} <span className="text-gray-400">({groupItems.length})</span>
          </h3>
          <ul className="flex flex-col gap-2">
            {groupItems.map((item) => {
              const expanded = expandedId === item.id
              return (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(expanded ? null : item.id)
                    }
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="truncate text-sm font-medium text-gray-900">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {expanded ? '접기 ▲' : '펼치기 ▼'}
                    </span>
                  </button>

                  {expanded && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      {item.youtube_video_id && (
                        <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-black">
                          <iframe
                            className="h-full w-full"
                            src={`https://www.youtube.com/embed/${item.youtube_video_id}`}
                            title={item.name}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {item.instagram_url && (
                        <a
                          href={item.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-3 inline-block text-xs font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          📸 인스타그램에서 보기 →
                        </a>
                      )}
                      {item.ingredients && (
                        <div className="mb-3">
                          <p className="mb-1 text-xs font-semibold text-gray-500">
                            재료
                          </p>
                          <p className="whitespace-pre-line text-sm text-gray-700">
                            {item.ingredients}
                          </p>
                        </div>
                      )}
                      {item.instructions && (
                        <div className="mb-3">
                          <p className="mb-1 text-xs font-semibold text-gray-500">
                            조리법
                          </p>
                          <p className="whitespace-pre-line text-sm text-gray-700">
                            {item.instructions}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
