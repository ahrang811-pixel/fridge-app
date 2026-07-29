import { writeLocalStorage } from '../../hooks/useLocalStorage'

export const EXPENSES_KEY = 'fridge:expenses'

function readExpenses() {
  try {
    return JSON.parse(window.localStorage.getItem(EXPENSES_KEY) || '{}')
  } catch {
    return {}
  }
}

// 영수증에서 인식한 금액처럼, ExpensesTab이 열려 있지 않아도 특정 날짜의
// 식비에 금액을 더해 넣을 때 쓴다. (같은 날짜에 이미 금액이 있으면 합산)
export function addExpenseAmount(dateKey, amount) {
  if (!Number.isFinite(amount) || amount <= 0) return

  const current = readExpenses()
  const prevAmount = Number(current[dateKey]) || 0
  writeLocalStorage(EXPENSES_KEY, { ...current, [dateKey]: prevAmount + amount })
}
