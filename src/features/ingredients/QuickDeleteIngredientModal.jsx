import { useMemo, useState } from 'react'
import { getCategoryIcon } from './categoryDefaults'

// 보유 중인 재료 카드를 눌러 바로 삭제하는 모달. 실수 삭제를 막기 위해
// 카드 선택 -> 확인 두 단계로 이루어진다.
export function QuickDeleteIngredientModal({ items, deleteItem, onClose }) {
  const [search, setSearch] = useState('')
  const [target, setTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deletedCount, setDeletedCount] = useState(0)

  const query = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!query) return items
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, query])

  const handleDelete = async () => {
    if (!target || deleting) return
    setDeleting(true)
    try {
      await deleteItem(target.id)
      setDeletedCount((prev) => prev + 1)
      setTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            재료 삭제{deletedCount > 0 ? ` · ${deletedCount}개 삭제됨` : ''}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
          >
            닫기
          </button>
        </div>

        {!target && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="px-5 pt-4">
              <input
                type="search"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 삭제할 재료 이름으로 검색"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="mt-3 flex-1 overflow-y-auto px-5 pb-4">
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  {items.length === 0
                    ? '보유 중인 식재료가 없어요.'
                    : '검색 결과가 없어요.'}
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTarget(item)}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition hover:border-red-300 hover:shadow-md"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-3xl">
                        <span aria-hidden="true">{getCategoryIcon(item.category)}</span>
                      </div>
                      <p className="w-full truncate text-xs font-medium text-gray-900">
                        {item.name}
                      </p>
                      {item.quantity && (
                        <p className="w-full truncate text-[11px] text-gray-400">
                          {item.quantity}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {target && (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                <span aria-hidden="true">{getCategoryIcon(target.category)}</span>
              </div>
              <p className="text-base font-semibold text-gray-900">{target.name}</p>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                {target.category}
              </span>
              <p className="mt-2 text-center text-sm text-gray-500">
                이 재료를 목록에서 삭제할까요?
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setTarget(null)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? '삭제하는 중…' : '삭제'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
