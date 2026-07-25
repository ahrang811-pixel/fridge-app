export function Sidebar({ tabs, activeTab, onChange, spaceName, onSignOut }) {
  return (
    <aside className="flex shrink-0 flex-col border-b border-gray-200 bg-white sm:w-56 sm:border-b-0 sm:border-r">
      <div className="px-4 py-4 sm:px-5">
        <h1 className="text-lg font-semibold text-gray-900">🧊 냉장고 정리</h1>
        {spaceName && (
          <p className="mt-0.5 truncate text-xs text-gray-400">
            {spaceName}
          </p>
        )}
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 sm:flex-1 sm:flex-col sm:overflow-visible sm:px-3 sm:pb-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {onSignOut && (
        <div className="px-2 pb-4 sm:px-3">
          <button
            type="button"
            onClick={onSignOut}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            로그아웃
          </button>
        </div>
      )}
    </aside>
  )
}
