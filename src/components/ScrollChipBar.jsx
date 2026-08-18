// 상단에 배치하는 가로 스크롤 칩 목록. 카테고리 필터, 뷰 전환 등
// "여러 옵션 중 하나를 고른다" 형태의 UI에서 공통으로 쓴다.
export function ScrollChipBar({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const isActive = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-gray-200 bg-white text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
