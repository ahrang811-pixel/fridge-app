export function MealTypeSettings({ mealTypes, onToggle }) {
  const enabledCount = mealTypes.filter((m) => m.enabled).length

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white shadow-sm p-3">
      {mealTypes.map((mt) => (
        <label
          key={mt.id}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <input
            type="checkbox"
            checked={mt.enabled}
            onChange={() => onToggle(mt.id)}
            disabled={mt.enabled && enabledCount === 1}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          {mt.label}
        </label>
      ))}
    </div>
  )
}
