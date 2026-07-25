import { useEffect, useState } from 'react'

const emptyForm = (categories) => ({
  name: '',
  category: categories[0] ?? '',
  ingredients: '',
  instructions: '',
})

export function RecipeForm({ categories, editingItem, onSubmit, onCancelEdit }) {
  const [form, setForm] = useState(() => emptyForm(categories))

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name,
        category: editingItem.category,
        ingredients: editingItem.ingredients,
        instructions: editingItem.instructions,
      })
    } else {
      setForm(emptyForm(categories))
    }
  }, [editingItem])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return

    onSubmit({
      name,
      category: form.category,
      ingredients: form.ingredients.trim(),
      instructions: form.instructions.trim(),
    })
    if (!editingItem) setForm(emptyForm(categories))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white shadow-sm p-4"
    >
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[140px] flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            요리 이름
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="예: 김치찌개"
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
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          재료 (한 줄에 하나씩)
        </label>
        <textarea
          value={form.ingredients}
          onChange={handleChange('ingredients')}
          placeholder={'예: 김치 1/2포기\n돼지고기 200g\n두부 1모'}
          rows={3}
          className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          조리법
        </label>
        <textarea
          value={form.instructions}
          onChange={handleChange('instructions')}
          placeholder={'예: 1. 김치를 볶는다\n2. 물을 붓고 끓인다\n3. 두부와 고기를 넣는다'}
          rows={4}
          className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2 self-end">
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
