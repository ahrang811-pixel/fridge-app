import { CoupangSearchButton } from '../../components/CoupangSearchButton'
import { COUPANG_PARTNERS_DISCLOSURE } from '../../utils/affiliateLink'

export function ShoppingList({ items, onToggle, onDelete }) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        장봐야 할 항목이 없습니다. 위에서 추가해보세요.
      </p>
    )
  }

  const pending = items.filter((item) => !item.checked)
  const purchased = items.filter((item) => item.checked)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[11px] text-gray-400">{COUPANG_PARTNERS_DISCLOSURE}</p>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-500">
          담아야 할 항목 <span className="text-gray-400">({pending.length})</span>
        </h3>
        {pending.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
            모두 담았어요!
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {pending.map((item) => (
              <ShoppingRow
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>

      {purchased.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            구매 완료 <span className="text-gray-400">({purchased.length})</span>
          </h3>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {purchased.map((item) => (
              <ShoppingRow
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ShoppingRow({ item, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item.id)}
        className="h-4 w-4 shrink-0 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            item.checked ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {item.name}
        </p>
        {item.quantity && (
          <p className="text-xs text-gray-400">{item.quantity}</p>
        )}
      </div>
      <CoupangSearchButton keyword={item.name} />
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
      >
        삭제
      </button>
    </li>
  )
}
