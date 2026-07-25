import { DayMealEditor } from './DayMealEditor'
import {
  WEEKDAY_LABELS,
  addDays,
  formatMonthDay,
  getWeekDates,
  isToday,
  toDateKey,
} from '../../utils/date-utils'

export function WeeklyView({
  mealsByDate,
  mealTypes,
  referenceDate,
  onChangeReferenceDate,
  updateMeal,
}) {
  const weekDates = getWeekDates(referenceDate)
  const weekKeys = weekDates.map(toDateKey)

  const goPrevWeek = () => onChangeReferenceDate(addDays(referenceDate, -7))
  const goNextWeek = () => onChangeReferenceDate(addDays(referenceDate, 7))
  const goToday = () => onChangeReferenceDate(new Date())

  const rangeLabel = `${formatMonthDay(weekDates[0])} - ${formatMonthDay(weekDates[6])}`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3">
        <button
          type="button"
          onClick={goPrevWeek}
          className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-gray-900">
          {rangeLabel}
        </span>
        <button
          type="button"
          onClick={goNextWeek}
          className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
        >
          ›
        </button>
        <button
          type="button"
          onClick={goToday}
          className="ml-1 rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
        >
          오늘
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {weekDates.map((date, i) => {
          const dateKey = weekKeys[i]
          const dayOfWeek = date.getDay()
          return (
            <div
              key={dateKey}
              className={`rounded-xl border bg-white p-3 shadow-sm ${
                isToday(date) ? 'border-emerald-400' : 'border-gray-200'
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    dayOfWeek === 0
                      ? 'text-red-500'
                      : dayOfWeek === 6
                        ? 'text-blue-500'
                        : 'text-gray-900'
                  }`}
                >
                  {WEEKDAY_LABELS[dayOfWeek]}
                </span>
                <span className="text-xs text-gray-400">
                  {formatMonthDay(date)}
                </span>
                {isToday(date) && (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                    오늘
                  </span>
                )}
              </div>
              <DayMealEditor
                dateKey={dateKey}
                meals={mealsByDate[dateKey]}
                mealTypes={mealTypes}
                onUpdateMeal={updateMeal}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
