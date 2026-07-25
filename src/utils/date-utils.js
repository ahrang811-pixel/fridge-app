export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function addMonths(date, months) {
  const d = new Date(date)
  d.setDate(1)
  d.setMonth(d.getMonth() + months)
  return d
}

export function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

export function getWeekDates(date) {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function getMonthGridDates(date) {
  const gridStart = startOfWeek(startOfMonth(date))
  const gridEndWeekStart = startOfWeek(endOfMonth(date))
  const totalDays =
    Math.round(
      (addDays(gridEndWeekStart, 6) - gridStart) / (1000 * 60 * 60 * 24),
    ) + 1
  return Array.from({ length: totalDays }, (_, i) => addDays(gridStart, i))
}

export function isSameMonth(date, reference) {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  )
}

export function isToday(date) {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export function formatMonthDay(date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

export function formatMonthLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}
