import { useState } from 'react'
import { useSpaceTable } from '../../hooks/useSpaceTable'
import { useSpaceSettings } from '../settings/useSpaceSettings'
import { IngredientForm } from './IngredientForm'
import { IngredientList } from './IngredientList'
import { ReceiptScanFlow } from './receipt/ReceiptScanFlow'

function toApp(row) {
  return { ...row, expiryDate: row.expiry_date, purchaseDate: row.purchase_date }
}

function toRow({ expiryDate, purchaseDate, ...rest }) {
  return { ...rest, expiry_date: expiryDate, purchase_date: purchaseDate }
}

export function IngredientsTab({ spaceId }) {
  const {
    items: rows,
    addItem,
    updateItem,
    deleteItem,
  } = useSpaceTable('ingredients', spaceId)
  const { ingredientCategories: categories } = useSpaceSettings(spaceId)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  const items = rows.map(toApp)
  const editingItem = items.find((item) => item.id === editingId) ?? null
  const query = search.trim().toLowerCase()
  const visibleItems = query
    ? items.filter((item) => item.name.toLowerCase().includes(query))
    : items

  const handleSubmit = async (data) => {
    if (editingId) {
      await updateItem(editingId, toRow(data))
      setEditingId(null)
    } else {
      await addItem(toRow(data))
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
      await addItem(toRow(item))
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
