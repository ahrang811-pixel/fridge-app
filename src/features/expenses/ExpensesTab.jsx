import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { formatWon } from '../../utils/currency'
import {
  WEEKDAY_LABELS,
  addMonths,
  formatMonthLabel,
  getMonthGridDates,
  isSameMonth,
  isToday,
  toDateKey,
} from '../../utils/date-utils'

export function ExpensesTab() {
  const [expensesByDate, setExpensesByDate] = useLocalStorage(
    'fridge:expenses',
    {},
  )
  const [referenceDate, setReferenceDate] = useState(() => new Date())

  const gridDates = getMonthGridDates(referenceDate)
  const monthKeys = gridDates
    .filter((d) => isSameMonth(d, referenceDate))
    .map(toDateKey)
  const monthTotal = monthKeys.reduce(
    (sum, key) => sum + (Number(expensesByDate[key]) || 0),
    0,
  )

  const goPrevMonth = () => setReferenceDate(addMonths(referenceDate, -1))
  const goNextMonth = () => setReferenceDate(addMonths(referenceDate, 1))
  const goToday = () => setReferenceDate(new Date())

  const updateExpense = (key, value) => {
    setExpensesByDate((prev) => {
      const amount = Number(value) || 0
      if (amount === 0) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: amount }
    })
  }

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

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center">
        <p className="text-sm text-gray-500">
          {formatMonthLabel(referenceDate)} 총 식비
        </p>
        <p className="mt-1 text-4xl font-bold text-emerald-600">
          {formatWon(monthTotal)}
        </p>
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
        <div className="grid grid-cols-7 gap-1">
          {gridDates.map((date) => {
            const key = toDateKey(date)
            const inMonth = isSameMonth(date, referenceDate)
            const amount = expensesByDate[key] || ''
            return (
              <div
                key={key}
                className={`flex flex-col items-center gap-1 rounded-md border p-1 ${
                  isToday(date) ? 'border-emerald-400' : 'border-gray-100'
                } ${!inMonth ? 'opacity-40' : ''}`}
              >
                <span className="text-xs font-medium text-gray-600">
                  {date.getDate()}
                </span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => updateExpense(key, e.target.value)}
                  placeholder="-"
                  className="w-full rounded border border-gray-200 px-1 py-1 text-center text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
