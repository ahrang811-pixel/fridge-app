import { useState } from 'react'
import { getCategoryDefault } from './categoryDefaults'
import {
  EXPIRY_ROW_STYLES,
  EXPIRY_STATUS_STYLES,
  formatExpiryLabel,
  getDaysUntilExpiry,
  getEstimatedExpiryDate,
  getExpiryStatus,
} from './expiry'
import { findIngredientMatch } from './ingredientKnowledge'

function sortByExpiry(items) {
  return [...items].sort((a, b) => {
    if (a.days === null && b.days === null) return 0
    if (a.days === null) return 1
    if (b.days === null) return -1
    return a.days - b.days
  })
}

export function IngredientList({ categories, items, isFiltered, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null)

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        {isFiltered
          ? '검색 결과가 없습니다.'
          : '등록된 식재료가 없습니다. 위에서 추가해보세요.'}
      </p>
    )
  }

  const withExpiry = items.map((item) => {
    const categoryDefault = getCategoryDefault(item.category)
    const isEstimated = !item.expiryDate && !!item.purchaseDate
    const effectiveExpiryDate =
      item.expiryDate ||
      getEstimatedExpiryDate(item.purchaseDate, categoryDefault.shelfLifeDays)
    const days = getDaysUntilExpiry(effectiveExpiryDate)
    const knownTip = findIngredientMatch(item.name)?.tip ?? null
    return {
      ...item,
      days,
      status: getExpiryStatus(days),
      isEstimated,
      categoryDefault,
      tip: knownTip,
    }
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
            {groupItems.map((item) => {
              const expanded = expandedId === item.id
              return (
                <li key={item.id} className={EXPIRY_ROW_STYLES[item.status]}>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId((prev) => (prev === item.id ? null : item.id))
                      }
                      className="min-w-0 flex-1 text-left"
                      aria-expanded={expanded}
                    >
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {item.quantity}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${EXPIRY_STATUS_STYLES[item.status]}`}
                        >
                          {formatExpiryLabel(item.days)}
                          {item.isEstimated && item.days !== null ? ' (예상)' : ''}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-400">
                        {item.purchaseDate && (
                          <span>구매일 {item.purchaseDate}</span>
                        )}
                        <span>{item.categoryDefault.storageMethod}</span>
                      </div>
                    </button>
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
                  </div>

                  {expanded && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
                      <p className="mb-1 font-medium text-gray-700">
                        💡 보관 팁
                      </p>
                      <p>{item.tip ?? item.categoryDefault.note}</p>
                      {!item.tip && (
                        <p className="mt-1 text-[11px] text-gray-400">
                          {item.name}에 대한 개별 팁은 아직 없어서 "{item.category}"
                          카테고리 기본 정보를 보여드려요.
                        </p>
                      )}
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
