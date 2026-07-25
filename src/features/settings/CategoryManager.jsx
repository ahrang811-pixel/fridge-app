import { useState } from 'react'

export function CategoryManager({
  categories,
  protectedCategory,
  onAdd,
  onRename,
  onDelete,
}) {
  const [newName, setNewName] = useState('')
  const [editingName, setEditingName] = useState(null)
  const [editingValue, setEditingValue] = useState('')

  const startEdit = (name) => {
    setEditingName(name)
    setEditingValue(name)
  }

  const commitEdit = (oldName) => {
    const trimmed = editingValue.trim()
    setEditingName(null)
    if (!trimmed || trimmed === oldName || categories.includes(trimmed)) return
    onRename(oldName, trimmed)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed || categories.includes(trimmed)) return
    onAdd(trimmed)
    setNewName('')
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {categories.map((name) => {
          const isProtected = name === protectedCategory
          const isEditing = editingName === name

          return (
            <li key={name} className="flex items-center gap-2 px-3 py-2">
              {isEditing ? (
                <input
                  autoFocus
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => commitEdit(name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      commitEdit(name)
                    }
                    if (e.key === 'Escape') setEditingName(null)
                  }}
                  className="flex-1 rounded-md border border-emerald-400 px-2 py-1 text-sm focus:outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => !isProtected && startEdit(name)}
                  disabled={isProtected}
                  className={`flex-1 truncate text-left text-sm ${
                    isProtected
                      ? 'text-gray-400'
                      : 'text-gray-900 hover:underline'
                  }`}
                >
                  {name}
                </button>
              )}

              {isProtected ? (
                <span className="shrink-0 text-[10px] text-gray-300">
                  기본
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onDelete(name)}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  삭제
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 카테고리 이름"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          추가
        </button>
      </form>
    </div>
  )
}
