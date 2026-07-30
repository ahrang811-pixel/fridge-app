import { useEffect, useState } from 'react'
import { CoupangSearchButton } from '../../components/CoupangSearchButton'
import { COUPANG_PARTNERS_DISCLOSURE } from '../../utils/affiliateLink'
import { getCategoryIcon } from './categoryDefaults'
import { formatExpiryLabel } from './expiry'
import { fetchIngredientFacts } from './ingredientFactsClient'
import { useIngredientImage } from './useIngredientImage'

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1 border-t border-gray-100 pt-3 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold text-gray-500">{title}</h3>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  )
}

export function IngredientDetailModal({ item, onClose, onEdit, onDelete }) {
  const imageUrl = useIngredientImage(item.name)
  const [facts, setFacts] = useState(null)
  const [factsError, setFactsError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setFacts(null)
    setFactsError(null)

    fetchIngredientFacts({ name: item.name, category: item.category })
      .then((data) => {
        if (!cancelled) setFacts(data)
      })
      .catch((err) => {
        if (!cancelled) setFactsError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [item.name, item.category])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">식재료 상세</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
          >
            닫기
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-50 text-5xl">
              {imageUrl ? (
                <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <span aria-hidden="true">{getCategoryIcon(item.category)}</span>
              )}
            </div>
            <p className="text-base font-semibold text-gray-900">{item.name}</p>
            <span className="text-xs text-gray-400">
              {formatExpiryLabel(item.days)}
              {item.isEstimated && item.days !== null ? ' (예상)' : ''}
              {item.quantity ? ` · ${item.quantity}` : ''}
            </span>
          </div>

          <div className="mt-4 flex flex-col items-center gap-1">
            <CoupangSearchButton keyword={item.name} variant="button" />
            <p className="text-center text-[11px] text-gray-400">
              {COUPANG_PARTNERS_DISCLOSURE}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Section title="보관 방법">
              {factsError ? (
                <p className="text-xs text-gray-400">정보를 가져오지 못했어요.</p>
              ) : facts?.storageMethods?.length ? (
                <ul className="flex flex-col gap-2">
                  {facts.storageMethods.map((method, i) => (
                    <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-gray-800">{method.method}</span>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                          {method.period}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{method.tips}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">불러오는 중…</p>
              )}
              {item.tip && <p className="mt-1 text-xs text-gray-500">💡 {item.tip}</p>}
            </Section>

            <Section title="최대 보관기한">
              {factsError ? (
                <p className="text-xs text-gray-400">정보를 가져오지 못했어요.</p>
              ) : facts ? (
                <p>
                  {facts.maxStorageDays != null
                    ? `최대 ${facts.maxStorageDays}일`
                    : '정보 없음'}
                </p>
              ) : (
                <p className="text-xs text-gray-400">불러오는 중…</p>
              )}
            </Section>

            <Section title="구입 시 꿀팁">
              {factsError ? (
                <p className="text-xs text-gray-400">정보를 가져오지 못했어요.</p>
              ) : facts ? (
                <p>{facts.buyingTip || '정보 없음'}</p>
              ) : (
                <p className="text-xs text-gray-400">불러오는 중…</p>
              )}
            </Section>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
