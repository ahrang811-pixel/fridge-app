export function SegmentedToggle({ options, value, onChange, className = '' }) {
  return (
    <div
      className={`flex gap-1 self-start rounded-xl border border-gray-200 bg-white shadow-sm p-1 ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.id
              ? 'bg-emerald-600 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
