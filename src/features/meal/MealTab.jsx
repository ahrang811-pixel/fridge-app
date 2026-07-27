import { useState } from 'react'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { ExpensesTab } from '../expenses/ExpensesTab'
import { MealPlanTab } from '../mealplan/MealPlanTab'

const VIEWS = [
  { id: 'mealplan', label: '메뉴' },
  { id: 'expenses', label: '식비' },
]

export function MealTab({ spaceId }) {
  const [view, setView] = useState('mealplan')

  return (
    <div className="flex flex-col gap-4">
      <SegmentedToggle options={VIEWS} value={view} onChange={setView} />

      {view === 'mealplan' ? (
        <MealPlanTab spaceId={spaceId} />
      ) : (
        <ExpensesTab />
      )}
    </div>
  )
}
