import { useMemo, useState } from 'react'
import { todayKey } from '../../utils/date-utils'
import { getCategoryIcon } from './categoryDefaults'
import { KNOWN_INGREDIENTS } from './ingredientKnowledge'

const DEFAULT_QUANTITY = '1개'

function resolveCategory(rawCategory, categories) {
  return categories.includes(rawCategory) ? rawCategory : (categories[0] ?? rawCategory)
}

// 카드 선택(browse) -> 구매일 확인(confirm) 두 단계로 이루어진 빠른 등록 모달.
// 목록에 없는 재료는 "직접 입력" 모드로 전환해 이름/카테고리를 손으로 채운다.
export function QuickAddIngredientModal({ categories, addItem, onClose }) {
  const [step, setStep] = useState('browse') // 'browse' | 'confirm'
  const [search, setSearch] = useState('')
  const [customMode, setCustomMode] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customCategory, setCustomCategory] = useState(categories[0] ?? '')
  const [selected, setSelected] = useState(null) // { name, category }
  const [purchaseDate, setPurchaseDate] = useState(todayKey())
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY)
  const [saving, setSaving] = useState(false)
  const [addedNames, setAddedNames] = useState([])

  const query = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!query) return KNOWN_INGREDIENTS
    return KNOWN_INGREDIENTS.filter((item) => item.name.toLowerCase().includes(query))
  }, [query])

  const pickKnown = (item) => {
    setSelected({ name: item.name, category: resolveCategory(item.category, categories) })
    setPurchaseDate(todayKey())
    setQuantity(DEFAULT_QUANTITY)
    setStep('confirm')
  }

  const startCustom = () => {
    setCustomName(search.trim())
    setCustomCategory(categories[0] ?? '')
    setCustomMode(true)
  }

  const confirmCustom = (e) => {
    e.preventDefault()
    const name = customName.trim()
    if (!name) return
    setSelected({ name, category: customCategory })
    setPurchaseDate(todayKey())
    setQuantity(DEFAULT_QUANTITY)
    setCustomMode(false)
    setStep('confirm')
  }

  const handleRegister = async () => {
    if (!selected || saving) return
    setSaving(true)
    try {
      await addItem({
        name: selected.name,
        quantity: quantity.trim() || DEFAULT_QUANTITY,
        category: selected.category,
        purchaseDate: purchaseDate || null,
        expiryDate: null,
      })
      setAddedNames((prev) => [selected.name, ...prev])
      setSelected(null)
      setStep('browse')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            재료 추가{addedNames.length > 0 ? ` · ${addedNames.length}개 등록됨` : ''}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
          >
            닫기
          </button>
        </div>

        {step === 'browse' && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-col gap-2 px-5 pt-4">
              <input
                type="search"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 재료 이름으로 검색"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />

              {addedNames.length > 0 && (
                <p className="text-xs text-emerald-600">
                  ✅ 방금 추가함: {addedNames.slice(0, 3).join(', ')}
                  {addedNames.length > 3 ? ` 외 ${addedNames.length - 3}개` : ''}
                </p>
              )}

              {customMode ? (
                <form
                  onSubmit={confirmCustom}
                  className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3"
                >
                  <label className="text-xs font-medium text-gray-500">
                    재료 이름 직접 입력
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="예: 알로에"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <label className="text-xs font-medium text-gray-500">카테고리</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      다음
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomMode(false)}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={startCustom}
                  className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 hover:border-emerald-400 hover:text-emerald-600"
                >
                  ✏️ 목록에 없나요? 직접 입력하기
                </button>
              )}
            </div>

            <div className="mt-3 flex-1 overflow-y-auto px-5 pb-4">
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  검색 결과가 없어요. 위에서 직접 입력해보세요.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {filtered.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => pickKnown(item)}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-3xl">
                        <span aria-hidden="true">{getCategoryIcon(item.category)}</span>
                      </div>
                      <p className="w-full truncate text-xs font-medium text-gray-900">
                        {item.name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'confirm' && selected && (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                <span aria-hidden="true">{getCategoryIcon(selected.category)}</span>
              </div>
              <p className="text-base font-semibold text-gray-900">{selected.name}</p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                {selected.category}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">수량</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">구매일</label>
                <input
                  type="date"
                  autoFocus
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  max={todayKey()}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelected(null)
                  setStep('browse')
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                ‹ 다시 선택
              </button>
              <button
                type="button"
                onClick={handleRegister}
                disabled={saving}
                className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? '등록하는 중…' : '바로 등록'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
