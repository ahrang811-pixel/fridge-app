import { useCallback, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { formatWon } from '../../utils/currency'
import { ExpenseDayCell } from './ExpenseDayCell'
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

  const updateExpense = useCallback(
    (key, value) => {
      setExpensesByDate((prev) => {
        const amount = Number(value) || 0
        const prevAmount = prev[key]
        if (amount === 0) {
          if (prevAmount === undefined) return prev
          const next = { ...prev }
          delete next[key]
          return next
        }
        if (prevAmount === amount) return prev
        return { ...prev, [key]: amount }
      })
    },
    [setExpensesByDate],
  )

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

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 sm:p-4">
        <div className="grid grid-cols-7 gap-1.5 pb-2 text-center text-xs font-medium text-gray-400 sm:gap-2 sm:text-sm">
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
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {gridDates.map((date) => {
            const key = toDateKey(date)
            return (
              <ExpenseDayCell
                key={key}
                day={date.getDate()}
                dateKey={key}
                amount={expensesByDate[key]}
                inMonth={isSameMonth(date, referenceDate)}
                isTodayDate={isToday(date)}
                onCommit={updateExpense}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
