import { useState } from 'react'

const EMPTY_FORM = { name: '', quantity: '' }

export function ShoppingForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return

    onSubmit({ name, quantity: form.quantity.trim() })
    setForm(EMPTY_FORM)
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
          placeholder="예: 우유"
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
          placeholder="예: 1개"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        추가
      </button>
    </form>
  )
}
