import { useEffect, useRef, useState } from 'react'
import { findIngredientMatch } from './ingredientKnowledge'
import { addYears, todayKey, toDateKey } from '../../utils/date-utils'

const MAX_EXPIRY_DATE = toDateKey(addYears(new Date(), 5))

const emptyForm = (categories) => ({
  name: '',
  quantity: '',
  category: categories[0] ?? '',
  purchaseDate: todayKey(),
  expiryDate: '',
})

export function IngredientForm({
  categories,
  editingItem,
  onSubmit,
  onCancelEdit,
}) {
  const [form, setForm] = useState(() => emptyForm(categories))
  const categoryTouchedRef = useRef(false)

  useEffect(() => {
    categoryTouchedRef.current = false
    if (editingItem) {
      setForm({
        name: editingItem.name,
        quantity: editingItem.quantity,
        category: editingItem.category,
        purchaseDate: editingItem.purchaseDate ?? '',
        expiryDate: editingItem.expiryDate ?? '',
      })
    } else {
      setForm(emptyForm(categories))
    }
  }, [editingItem])

  const handleChange = (field) => (e) => {
    const value = e.target.value

    if (field === 'category') categoryTouchedRef.current = true

    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && !categoryTouchedRef.current) {
        const match = findIngredientMatch(value)
        if (match && categories.includes(match.category)) {
          next.category = match.category
        }
      }
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    const quantity = form.quantity.trim()
    if (!name || !quantity) return

    onSubmit({
      name,
      quantity,
      category: form.category,
      purchaseDate: form.purchaseDate || null,
      expiryDate: form.expiryDate || null,
    })
    if (!editingItem) {
      categoryTouchedRef.current = false
      setForm(emptyForm(categories))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white shadow-sm p-4"
    >
      <div className="min-w-[140px] flex-1">
        <label className="mb-1 block text-xs font-medium text-gray-500">
          이름
        </label>
        <input
          type="text"
          value={form.name}
          onChange={handleChange('name')}
          placeholder="예: 계란"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-gray-500">
          수량
        </label>
        <input
          type="text"
          value={form.quantity}
          onChange={handleChange('quantity')}
          placeholder="예: 10개"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="w-40">
        <label className="mb-1 block text-xs font-medium text-gray-500">
          구매일
        </label>
        <input
          type="date"
          value={form.purchaseDate}
          onChange={handleChange('purchaseDate')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="w-40">
        <label className="mb-1 block text-xs font-medium text-gray-500">
          유통기한
        </label>
        <input
          type="date"
          value={form.expiryDate}
          onChange={handleChange('expiryDate')}
          min={form.purchaseDate || todayKey()}
          max={MAX_EXPIRY_DATE}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="w-36">
        <label className="mb-1 block text-xs font-medium text-gray-500">
          카테고리
        </label>
        <select
          value={form.category}
          onChange={handleChange('category')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {editingItem ? '수정 완료' : '추가'}
        </button>
        {editingItem && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}
