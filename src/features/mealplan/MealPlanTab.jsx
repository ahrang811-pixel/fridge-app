import { useState } from 'react'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { useSpaceSettings } from '../settings/useSpaceSettings'
import { CalendarView } from './CalendarView'
import { WeeklyView } from './WeeklyView'
import { useMealPlan } from './useMealPlan'

const VIEWS = [
  { id: 'week', label: '주간 리스트' },
  { id: 'calendar', label: '달력' },
]

export function MealPlanTab({ spaceId }) {
  const { mealsByDate, updateMeal } = useMealPlan(spaceId)
  const { mealTypes: mealTypeSettings } = useSpaceSettings(spaceId)
  const mealTypes = mealTypeSettings.filter((mt) => mt.enabled)
  const [view, setView] = useState('week')
  const [referenceDate, setReferenceDate] = useState(() => new Date())

  return (
    <div className="flex flex-col gap-4">
      <SegmentedToggle options={VIEWS} value={view} onChange={setView} />

      {view === 'week' ? (
        <WeeklyView
          mealsByDate={mealsByDate}
          mealTypes={mealTypes}
          referenceDate={referenceDate}
          onChangeReferenceDate={setReferenceDate}
          updateMeal={updateMeal}
        />
      ) : (
        <CalendarView
          mealsByDate={mealsByDate}
          mealTypes={mealTypes}
          referenceDate={referenceDate}
          onChangeReferenceDate={setReferenceDate}
          updateMeal={updateMeal}
        />
      )}
    </div>
  )
}
