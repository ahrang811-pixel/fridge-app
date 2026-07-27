import { useState } from 'react'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { IngredientsTab } from '../ingredients/IngredientsTab'
import { ShoppingTab } from '../shopping/ShoppingTab'

const VIEWS = [
  { id: 'ingredients', label: '보유 중' },
  { id: 'shopping', label: '장봐야 할 것' },
]

export function InventoryTab({ spaceId }) {
  const [view, setView] = useState('ingredients')

  return (
    <div className="flex flex-col gap-4">
      <SegmentedToggle options={VIEWS} value={view} onChange={setView} />

      {view === 'ingredients' ? (
        <IngredientsTab spaceId={spaceId} />
      ) : (
        <ShoppingTab spaceId={spaceId} />
      )}
    </div>
  )
}
