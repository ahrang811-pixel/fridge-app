import { useState } from 'react'
import { DayMealEditor } from './DayMealEditor'
import {
  WEEKDAY_LABELS,
  addMonths,
  formatMonthDay,
  formatMonthLabel,
  getMonthGridDates,
  isSameMonth,
  isToday,
  parseDateKey,
  toDateKey,
} from '../../utils/date-utils'

export function CalendarView({
  mealsByDate,
  mealTypes,
  referenceDate,
  onChangeReferenceDate,
  updateMeal,
}) {
  const [selectedKey, setSelectedKey] = useState(() => toDateKey(new Date()))

  const gridDates = getMonthGridDates(referenceDate)

  const goPrevMonth = () => onChangeReferenceDate(addMonths(referenceDate, -1))
  const goNextMonth = () => onChangeReferenceDate(addMonths(referenceDate, 1))
  const goToday = () => {
    const today = new Date()
    onChangeReferenceDate(today)
    setSelectedKey(toDateKey(today))
  }

  const selectedDate = parseDateKey(selectedKey)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3">
        <button
          type="button"
          onClick={goPrevMonth}
          className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-gray-900">
          {formatMonthLabel(referenceDate)}
        </span>
        <button
          type="button"
          onClick={goNextMonth}
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

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
        <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs font-medium text-gray-400">
          {WEEKDAY_LABELS.map((w, i) => (
            <div
              key={w}
              className={
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : ''
              }
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {gridDates.map((date) => {
            const key = toDateKey(date)
            const inMonth = isSameMonth(date, referenceDate)
            const selected = key === selectedKey
            const dayMeals = mealsByDate[key] ?? {}
            const previewEntries = mealTypes
              .map((mt) => dayMeals[mt.id])
              .filter((menu) => menu && menu.trim())
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`flex min-h-16 flex-col items-start gap-0.5 rounded-md border p-1 text-left sm:min-h-20 sm:p-1.5 ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-transparent hover:bg-gray-50'
                } ${!inMonth ? 'opacity-40' : ''}`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium sm:h-6 sm:w-6 sm:text-xs ${
                    isToday(date)
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {date.getDate()}
                </span>
                <div className="flex w-full min-w-0 flex-col gap-0.5">
                  {previewEntries.slice(0, 2).map((menu, i) => (
                    <span
                      key={i}
                      className="w-full truncate text-left text-[10px] leading-tight text-gray-500 sm:text-[11px]"
                    >
                      {menu}
                    </span>
                  ))}
                  {previewEntries.length > 2 && (
                    <span className="text-left text-[10px] leading-tight text-gray-400">
                      +{previewEntries.length - 2}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          {formatMonthDay(selectedDate)} 식단
        </h4>
        <DayMealEditor
          dateKey={selectedKey}
          meals={mealsByDate[selectedKey]}
          mealTypes={mealTypes}
          onUpdateMeal={updateMeal}
        />
      </div>
    </div>
  )
}
