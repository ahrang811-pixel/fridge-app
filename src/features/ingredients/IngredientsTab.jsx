import { useState } from 'react'
import { useSpaceTable } from '../../hooks/useSpaceTable'
import { useSpaceSettings } from '../settings/useSpaceSettings'
import { IngredientForm } from './IngredientForm'
import { IngredientList } from './IngredientList'

function toApp(row) {
  return { ...row, expiryDate: row.expiry_date }
}

function toRow({ expiryDate, ...rest }) {
  return { ...rest, expiry_date: expiryDate }
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

  const items = rows.map(toApp)
  const editingItem = items.find((item) => item.id === editingId) ?? null

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

  return (
    <div className="flex flex-col gap-6">
      <IngredientForm
        categories={categories}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />
      <IngredientList
        categories={categories}
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
