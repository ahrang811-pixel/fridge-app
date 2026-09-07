import { useState } from 'react'
import { ScrollChipBar } from '../../components/ScrollChipBar'
import { useSpaceTable } from '../../hooks/useSpaceTable'
import { useSpaceSettings } from '../settings/useSpaceSettings'
import { IngredientsTab } from '../ingredients/IngredientsTab'
import { QuickIngredientFab } from '../ingredients/QuickIngredientFab'
import { ShoppingTab } from '../shopping/ShoppingTab'

const VIEWS = [
  { id: 'ingredients', label: '식재료' },
  { id: 'shopping', label: '장보기' },
]

function toApp(row) {
  return { ...row, expiryDate: row.expiry_date, purchaseDate: row.purchase_date }
}

function toRow({ expiryDate, purchaseDate, ...rest }) {
  return { ...rest, expiry_date: expiryDate, purchase_date: purchaseDate }
}

export function InventoryTab({ spaceId }) {
  const [view, setView] = useState('ingredients')

  const {
    items: rows,
    addItem: addRow,
    updateItem: updateRow,
    deleteItem,
  } = useSpaceTable('ingredients', spaceId)
  const { ingredientCategories: categories } = useSpaceSettings(spaceId)

  const items = rows.map(toApp)
  const addItem = (data) => addRow(toRow(data))
  const updateItem = (id, data) => updateRow(id, toRow(data))

  return (
    <div className="flex flex-col gap-4">
      <ScrollChipBar options={VIEWS} value={view} onChange={setView} />

      {view === 'ingredients' ? (
        <IngredientsTab
          categories={categories}
          items={items}
          addItem={addItem}
          updateItem={updateItem}
          deleteItem={deleteItem}
        />
      ) : (
        <ShoppingTab spaceId={spaceId} />
      )}

      <QuickIngredientFab
        categories={categories}
        items={items}
        addItem={addItem}
        deleteItem={deleteItem}
      />
    </div>
  )
}
