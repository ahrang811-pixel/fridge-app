import {
  EXPIRY_ROW_STYLES,
  EXPIRY_STATUS_STYLES,
  formatExpiryLabel,
  getDaysUntilExpiry,
  getExpiryStatus,
} from './expiry'

function sortByExpiry(items) {
  return [...items].sort((a, b) => {
    if (a.days === null && b.days === null) return 0
    if (a.days === null) return 1
    if (b.days === null) return -1
    return a.days - b.days
  })
}

export function IngredientList({ categories, items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        등록된 식재료가 없습니다. 위에서 추가해보세요.
      </p>
    )
  }

  const withExpiry = items.map((item) => {
    const days = getDaysUntilExpiry(item.expiryDate)
    return { ...item, days, status: getExpiryStatus(days) }
  })

  const grouped = categories.map((category) => ({
    category,
    items: sortByExpiry(
      withExpiry.filter((item) => item.category === category),
    ),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ category, items: groupItems }) => (
        <div key={category}>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            {category} <span className="text-gray-400">({groupItems.length})</span>
          </h3>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {groupItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center justify-between gap-3 px-4 py-3 ${EXPIRY_ROW_STYLES[item.status]}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {item.quantity}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${EXPIRY_STATUS_STYLES[item.status]}`}
                    >
                      {formatExpiryLabel(item.days)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
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
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
