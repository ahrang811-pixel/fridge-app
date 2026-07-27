export function ReceiptReviewModal({
  candidates,
  categories,
  saving,
  onUpdate,
  onRemove,
  onToggleAll,
  onConfirm,
  onCancel,
}) {
  const checkedCount = candidates.filter((c) => c.checked).length
  const allChecked = candidates.length > 0 && checkedCount === candidates.length

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              영수증에서 찾은 식재료
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              추가할 항목을 확인하고 이름/수량/카테고리를 수정하세요.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            닫기
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-2">
          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={allChecked}
              disabled={saving}
              onChange={(e) => onToggleAll(e.target.checked)}
            />
            전체 선택 ({checkedCount}/{candidates.length})
          </label>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {candidates.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              추가할 항목이 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {candidates.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 p-2"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    disabled={saving}
                    onChange={(e) =>
                      onUpdate(item.id, { checked: e.target.checked })
                    }
                  />
                  <input
                    type="text"
                    value={item.name}
                    disabled={saving}
                    onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                    placeholder="이름"
                    className="min-w-[100px] flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
                  />
                  <input
                    type="text"
                    value={item.quantity}
                    disabled={saving}
                    onChange={(e) =>
                      onUpdate(item.id, { quantity: e.target.value })
                    }
                    placeholder="수량"
                    className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
                  />
                  <select
                    value={item.category}
                    disabled={saving}
                    onChange={(e) =>
                      onUpdate(item.id, { category: e.target.value })
                    }
                    className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onRemove(item.id)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={checkedCount === 0 || saving}
            onClick={onConfirm}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? '추가하는 중…' : `${checkedCount}개 식재료로 추가`}
          </button>
        </div>
      </div>
    </div>
  )
}
