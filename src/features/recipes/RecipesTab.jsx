import { useState } from 'react'
import { useSpaceTable } from '../../hooks/useSpaceTable'
import { getDaysUntilExpiry, getExpiryStatus } from '../ingredients/expiry'
import { useSpaceSettings } from '../settings/useSpaceSettings'
import { RecipeForm } from './RecipeForm'
import { RecipeList } from './RecipeList'
import { RecipeSuggestFlow } from './ai/RecipeSuggestFlow'
import { InstagramRecipeFlow } from './instagram/InstagramRecipeFlow'
import { YoutubeRecipeFlow } from './youtube/YoutubeRecipeFlow'

export function RecipesTab({ spaceId }) {
  const { items, addItem, updateItem, deleteItem } = useSpaceTable(
    'recipes',
    spaceId,
  )
  const { items: ingredientRows } = useSpaceTable('ingredients', spaceId)
  const { recipeCategories: categories } = useSpaceSettings(spaceId)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  const ingredientNames = [...new Set(ingredientRows.map((row) => row.name))]
  const urgentIngredientNames = [
    ...new Set(
      ingredientRows
        .filter(
          (row) => getExpiryStatus(getDaysUntilExpiry(row.expiry_date)) === 'urgent',
        )
        .map((row) => row.name),
    ),
  ]

  const editingItem = items.find((item) => item.id === editingId) ?? null

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

  const filteredItems = search.trim()
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : items

  return (
    <div className="flex flex-col gap-6">
      <RecipeSuggestFlow
        ingredientNames={ingredientNames}
        urgentIngredientNames={urgentIngredientNames}
        categories={categories}
        onSaveRecipe={addItem}
      />

      <YoutubeRecipeFlow categories={categories} onSaveRecipe={addItem} />

      <InstagramRecipeFlow categories={categories} onSaveRecipe={addItem} />

      <RecipeForm
        categories={categories}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="레시피 이름으로 검색"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
      />

      <RecipeList
        categories={categories}
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
