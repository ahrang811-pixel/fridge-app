export function getDaysUntilExpiry(expiryDate) {
  if (!expiryDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(expiryDate)
  target.setHours(0, 0, 0, 0)

  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

export function getExpiryStatus(days) {
  if (days === null) return 'none'
  if (days < 0) return 'expired'
  if (days <= 3) return 'urgent'
  if (days <= 7) return 'soon'
  return 'normal'
}

export function formatExpiryLabel(days) {
  if (days === null) return '기한 미입력'
  if (days < 0) return `${Math.abs(days)}일 지남`
  if (days === 0) return '오늘까지'
  return `D-${days}`
}

export const EXPIRY_STATUS_STYLES = {
  expired: 'border-red-300 bg-red-100 text-red-700',
  urgent: 'border-orange-300 bg-orange-100 text-orange-700',
  soon: 'border-amber-300 bg-amber-100 text-amber-700',
  normal: 'border-gray-200 bg-gray-50 text-gray-500',
  none: 'border-gray-200 bg-gray-50 text-gray-400',
}

export const EXPIRY_ROW_STYLES = {
  expired: 'bg-red-50',
  urgent: 'bg-orange-50',
  soon: '',
  normal: '',
  none: '',
}
