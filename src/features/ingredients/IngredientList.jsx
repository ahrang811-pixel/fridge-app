import { useState } from 'react'
import { getCategoryDefault } from './categoryDefaults'
import {
  getDaysUntilExpiry,
  getEstimatedExpiryDate,
  getExpiryStatus,
} from './expiry'
import { IngredientCard } from './IngredientCard'
import { IngredientDetailModal } from './IngredientDetailModal'
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
  const [selectedId, setSelectedId] = useState(null)

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

  const selectedItem = withExpiry.find((item) => item.id === selectedId) ?? null

  const handleEdit = (item) => {
    setSelectedId(null)
    onEdit(item)
  }

  const handleDelete = (id) => {
    setSelectedId(null)
    onDelete(id)
  }

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ category, items: groupItems }) => (
        <div key={category}>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            {category} <span className="text-gray-400">({groupItems.length})</span>
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {groupItems.map((item) => (
              <IngredientCard
                key={item.id}
                item={item}
                onClick={() => setSelectedId(item.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedItem && (
        <IngredientDetailModal
          item={selectedItem}
          onClose={() => setSelectedId(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
