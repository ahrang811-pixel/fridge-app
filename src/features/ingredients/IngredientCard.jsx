import { getCategoryIcon } from './categoryDefaults'
import { EXPIRY_STATUS_STYLES, formatExpiryLabel } from './expiry'
import { useIngredientImage } from './useIngredientImage'

export function IngredientCard({ item, onClick }) {
  const imageUrl = useIngredientImage(item.name)

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-50 text-3xl">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden="true">{getCategoryIcon(item.category)}</span>
        )}
      </div>
      <p className="w-full truncate text-sm font-medium text-gray-900">{item.name}</p>
      <span
        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${EXPIRY_STATUS_STYLES[item.status]}`}
      >
        {formatExpiryLabel(item.days)}
        {item.isEstimated && item.days !== null ? ' (예상)' : ''}
      </span>
    </button>
  )
}
