import { useSpaceTable } from '../../hooks/useSpaceTable'
import { ShoppingForm } from './ShoppingForm'
import { ShoppingList } from './ShoppingList'

export function ShoppingTab({ spaceId }) {
  const { items, addItem, updateItem, deleteItem } = useSpaceTable(
    'shopping_items',
    spaceId,
  )

  const handleAdd = (data) => addItem({ checked: false, ...data })

  const handleToggle = (id) => {
    const item = items.find((it) => it.id === id)
    if (!item) return
    updateItem(id, { checked: !item.checked })
  }

  const handleDelete = (id) => deleteItem(id)

  const handleClearPurchased = () => {
    items
      .filter((item) => item.checked)
      .forEach((item) => deleteItem(item.id))
  }

  const purchasedCount = items.filter((item) => item.checked).length

  return (
    <div className="flex flex-col gap-6">
      <ShoppingForm onSubmit={handleAdd} />

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
        items={items}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}
