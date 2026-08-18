import { useState } from 'react'
import { ALL_CATEGORY_ID, CategoryFilterBar } from './CategoryFilterBar'
import { IngredientForm } from './IngredientForm'
import { IngredientList } from './IngredientList'
import { ReceiptScanFlow } from './receipt/ReceiptScanFlow'

export function IngredientsTab({ categories, items, addItem, updateItem, deleteItem }) {
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_ID)

  const editingItem = items.find((item) => item.id === editingId) ?? null
  const query = search.trim().toLowerCase()
  const categoryFiltered =
    activeCategory === ALL_CATEGORY_ID
      ? items
      : items.filter((item) => item.category === activeCategory)
  const visibleItems = query
    ? categoryFiltered.filter((item) => item.name.toLowerCase().includes(query))
    : categoryFiltered

  const handleSubmit = async (data) => {
    if (editingId) {
      await updateItem(editingId, data)
      setEditingId(null)
    } else {
      await addItem(data)
    }
  }

  const handleEdit = (item) => setEditingId(item.id)
  const handleCancelEdit = () => setEditingId(null)

  const handleDelete = async (id) => {
    await deleteItem(id)
    if (editingId === id) setEditingId(null)
  }

  const handleImportFromReceipt = async (newItems) => {
    for (const item of newItems) {
      await addItem(item)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <CategoryFilterBar
        categories={categories}
        value={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 식재료 이름으로 검색"
          className="min-w-[160px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <ReceiptScanFlow categories={categories} onImportItems={handleImportFromReceipt} />
      </div>
      <IngredientForm
        categories={categories}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />
      <IngredientList
        categories={categories}
        items={visibleItems}
        isFiltered={!!query}
        groupByCategory={activeCategory === ALL_CATEGORY_ID}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
