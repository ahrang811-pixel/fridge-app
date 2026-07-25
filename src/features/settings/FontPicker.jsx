import { FONT_OPTIONS } from './defaults'

const GROUP_ORDER = ['고딕', '세리프', '라운드', '손글씨']

export function FontPicker({ fontId, onSelect }) {
  return (
    <div className="flex flex-col gap-5">
      {GROUP_ORDER.map((group) => (
        <div key={group}>
          <h3 className="mb-2 text-xs font-semibold text-gray-500">
            {group}
          </h3>
          <div className="flex flex-col gap-2">
            {FONT_OPTIONS.filter((f) => f.group === group).map((font) => {
              const selected = font.id === fontId
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onSelect(font.id)}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    selected
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span
                    style={{ fontFamily: font.family }}
                    className="text-base text-gray-900"
                  >
                    {font.label} — 가나다 ABC 123
                  </span>
                  {selected && (
                    <span className="shrink-0 text-xs font-medium text-emerald-600">
                      선택됨
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
