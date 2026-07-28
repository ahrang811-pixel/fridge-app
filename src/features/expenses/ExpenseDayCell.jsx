import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'

const COMMIT_DELAY_MS = 400

function formatWithCommas(digits) {
  if (!digits) return ''
  return Number(digits).toLocaleString('ko-KR')
}

export const ExpenseDayCell = memo(function ExpenseDayCell({
  day,
  dateKey,
  amount,
  inMonth,
  isTodayDate,
  onCommit,
}) {
  const [digits, setDigits] = useState(
    amount === undefined ? '' : String(amount),
  )
  const focusedRef = useRef(false)
  const timerRef = useRef(null)
  const inputRef = useRef(null)
  const pendingCursorRef = useRef(null)

  useEffect(() => {
    if (!focusedRef.current) {
      setDigits(amount === undefined ? '' : String(amount))
    }
  }, [amount])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useLayoutEffect(() => {
    if (pendingCursorRef.current == null) return
    const pos = pendingCursorRef.current
    pendingCursorRef.current = null
    inputRef.current?.setSelectionRange(pos, pos)
  }, [digits])

  const scheduleCommit = (value) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onCommit(dateKey, value)
    }, COMMIT_DELAY_MS)
  }

  const handleChange = (e) => {
    const raw = e.target.value
    const cursorPos = e.target.selectionStart ?? raw.length
    const digitsBeforeCursor = raw
      .slice(0, cursorPos)
      .replace(/[^0-9]/g, '').length
    const nextDigits = raw.replace(/[^0-9]/g, '')

    const formatted = formatWithCommas(nextDigits)
    let seen = 0
    let nextCursorPos = formatted.length
    if (digitsBeforeCursor === 0) {
      nextCursorPos = 0
    } else {
      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9]/.test(formatted[i])) seen++
        if (seen === digitsBeforeCursor) {
          nextCursorPos = i + 1
          break
        }
      }
    }
    pendingCursorRef.current = nextCursorPos

    setDigits(nextDigits)
    scheduleCommit(nextDigits)
  }

  const handleFocus = () => {
    focusedRef.current = true
  }

  const handleBlur = () => {
    focusedRef.current = false
    clearTimeout(timerRef.current)
    onCommit(dateKey, digits)
  }

  return (
    <div
      className={`flex min-h-16 flex-col items-center gap-1.5 rounded-lg border p-1.5 sm:min-h-20 sm:p-2 ${
        isTodayDate ? 'border-emerald-400' : 'border-gray-100'
      } ${!inMonth ? 'opacity-40' : ''}`}
    >
      <span className="text-xs font-medium text-gray-600 sm:text-sm">
        {day}
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={formatWithCommas(digits)}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="-"
        className="w-full rounded border border-gray-200 px-1 py-1.5 text-center text-xs focus:border-emerald-500 focus:outline-none sm:py-2 sm:text-sm"
      />
    </div>
  )
})
