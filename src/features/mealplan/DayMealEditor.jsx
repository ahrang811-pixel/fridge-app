export function DayMealEditor({ dateKey, meals, mealTypes, onUpdateMeal }) {
  return (
    <div className="flex flex-col gap-2">
      {mealTypes.map((mt) => (
        <div key={mt.id} className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-xs font-medium text-gray-400">
            {mt.label}
          </span>
          <input
            type="text"
            value={meals?.[mt.id] ?? ''}
            onChange={(e) => onUpdateMeal(dateKey, mt.id, e.target.value)}
            placeholder="메뉴"
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      ))}
    </div>
  )
}
