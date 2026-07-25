import { useState } from 'react'
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
      <div className="flex gap-1 self-start rounded-xl border border-gray-200 bg-white shadow-sm p-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === v.id
                ? 'bg-emerald-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

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
