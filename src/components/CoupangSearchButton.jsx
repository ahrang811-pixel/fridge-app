import { getCoupangSearchUrl } from '../utils/affiliateLink'

const VARIANT_STYLES = {
  link: 'shrink-0 rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50',
  button:
    'w-full rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800',
}

export function CoupangSearchButton({ keyword, variant = 'link', className = '' }) {
  return (
    <a
      href={getCoupangSearchUrl(keyword)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={(event) => event.stopPropagation()}
      className={`${VARIANT_STYLES[variant]} ${className}`}
    >
      최저가 보러가기
    </a>
  )
}
