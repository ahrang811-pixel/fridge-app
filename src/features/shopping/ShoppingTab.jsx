import { useState } from 'react'
import { ALL_CATEGORY_ID, CategoryFilterBar } from '../../components/CategoryFilterBar'
import { useSpaceTable } from '../../hooks/useSpaceTable'
import { useSpaceSettings } from '../settings/useSpaceSettings'
import { ShoppingForm } from './ShoppingForm'
import { ShoppingList } from './ShoppingList'

export function ShoppingTab({ spaceId }) {
  const { items, addItem, updateItem, deleteItem } = useSpaceTable(
    'shopping_items',
    spaceId,
  )
  const { shoppingCategories: categories } = useSpaceSettings(spaceId)
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_ID)

  const visibleItems =
    activeCategory === ALL_CATEGORY_ID
      ? items
      : items.filter((item) => item.category === activeCategory)

  const handleAdd = (data) => addItem({ checked: false, ...data })

  const handleToggle = (id) => {
    const item = items.find((it) => it.id === id)
    if (!item) return
    updateItem(id, { checked: !item.checked })
  }

  const handleDelete = (id) => deleteItem(id)

  // 필터가 걸려 있으면 화면에 보이는 항목만 정리해서, 버튼이 눈에 보이는
  // 목록과 다르게 동작하지 않도록 한다.
  const handleClearPurchased = () => {
    visibleItems
      .filter((item) => item.checked)
      .forEach((item) => deleteItem(item.id))
  }

  const purchasedCount = visibleItems.filter((item) => item.checked).length

  return (
    <div className="flex flex-col gap-6">
      <CategoryFilterBar
        categories={categories}
        value={activeCategory}
        onChange={setActiveCategory}
      />

      <ShoppingForm categories={categories} onSubmit={handleAdd} />

      {purchasedCount > 0 && (
        <div className="-mb-2 flex justify-end">
          <button
            type="button"
            onClick={handleClearPurchased}
            className="text-xs font-medium text-gray-400 hover:text-gray-600"
          >
            구매 완료 항목 정리
          </button>
        </div>
      )}

      <ShoppingList
        categories={categories}
        items={visibleItems}
        groupByCategory={activeCategory === ALL_CATEGORY_ID}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}
