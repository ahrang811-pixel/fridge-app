import { useState } from 'react'
import { QuickAddIngredientModal } from './QuickAddIngredientModal'
import { QuickDeleteIngredientModal } from './QuickDeleteIngredientModal'

// 내 냉장고 탭 우하단의 동그란 + 버튼. 누르면 "재료 추가"/"재료 삭제" 중
// 하나를 고르는 액션시트가 뜨고, 각각 전용 모달로 이어진다.
export function QuickIngredientFab({ categories, items, addItem, deleteItem }) {
  const [mode, setMode] = useState(null) // null | 'choose' | 'add' | 'delete'

  const close = () => setMode(null)

  return (
    <>
      <button
        type="button"
        onClick={() => setMode('choose')}
        aria-label="빠른 재료 등록"
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl font-light text-white shadow-lg transition hover:bg-emerald-700 active:scale-95 sm:right-8"
      >
        +
      </button>

      {mode === 'choose' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            className="flex w-full max-w-sm flex-col gap-2 rounded-t-2xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="px-1 pb-1 text-sm font-semibold text-gray-900">
              무엇을 할까요?
            </p>
            <button
              type="button"
              onClick={() => setMode('add')}
              className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50"
            >
              <span className="text-xl">➕</span>
              <span className="text-sm font-medium text-gray-900">재료 추가</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('delete')}
              className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50"
            >
              <span className="text-xl">🗑️</span>
              <span className="text-sm font-medium text-gray-900">재료 삭제</span>
            </button>
            <button
              type="button"
              onClick={close}
              className="mt-1 rounded-md px-3 py-2 text-center text-sm text-gray-400 hover:bg-gray-100"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {mode === 'add' && (
        <QuickAddIngredientModal
          categories={categories}
          addItem={addItem}
          onClose={close}
        />
      )}

      {mode === 'delete' && (
        <QuickDeleteIngredientModal
          items={items}
          deleteItem={deleteItem}
          onClose={close}
        />
      )}
    </>
  )
}
