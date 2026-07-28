import { useState } from 'react'
import { BottomTabBar } from './components/BottomTabBar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAuth } from './features/auth/AuthContext'
import { useSpace } from './features/space/SpaceContext'
import { SpaceOnboarding } from './features/space/SpaceOnboarding'
import { InventoryTab } from './features/inventory/InventoryTab'
import { MealTab } from './features/meal/MealTab'
import { RecipesTab } from './features/recipes/RecipesTab'
import { SettingsTab } from './features/settings/SettingsTab'
import {
  DEFAULT_FONT_ID,
  FONT_OPTIONS,
  SETTINGS_KEYS,
} from './features/settings/defaults'

const TABS = [
  { id: 'inventory', label: '재고 관리', icon: '📦' },
  { id: 'meal', label: '식단', icon: '🍽️' },
  { id: 'recipes', label: '레시피', icon: '📖' },
  { id: 'settings', label: '설정', icon: '⚙️' },
]

function LoadingScreen() {
  return (
    <div className="app-bg flex min-h-svh items-center justify-center text-sm text-gray-400">
      불러오는 중…
    </div>
  )
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [fontId] = useLocalStorage(SETTINGS_KEYS.font, DEFAULT_FONT_ID)
  const fontFamily =
    FONT_OPTIONS.find((f) => f.id === fontId)?.family ?? FONT_OPTIONS[0].family

  const { signOut } = useAuth()
  const {
    spaces,
    loading,
    activeSpace,
    setActiveSpaceId,
    createSpace,
    joinSpace,
    regenerateInviteCode,
    renameSpace,
    error,
  } = useSpace()

  if (loading) return <LoadingScreen />

  if (!activeSpace) {
    return (
      <div style={{ fontFamily }}>
        <SpaceOnboarding
          spaces={spaces}
          onSelect={setActiveSpaceId}
          onCreate={createSpace}
          onJoin={joinSpace}
          onSignOut={signOut}
          error={error}
        />
      </div>
    )
  }

  return (
    <div className="app-bg flex min-h-svh flex-col" style={{ fontFamily }}>
      <header className="px-4 py-4 sm:px-8">
        <h1 className="text-lg font-semibold text-gray-900">🧊 공유 냉장고</h1>
        <p className="mt-0.5 truncate text-xs text-gray-400">
          {activeSpace.name}
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-8 sm:py-8">
        {activeTab === 'inventory' && (
          <InventoryTab spaceId={activeSpace.id} />
        )}
        {activeTab === 'meal' && <MealTab spaceId={activeSpace.id} />}
        {activeTab === 'recipes' && <RecipesTab spaceId={activeSpace.id} />}
        {activeTab === 'settings' && (
          <SettingsTab
            spaceId={activeSpace.id}
            spaceName={activeSpace.name}
            inviteCode={activeSpace.invite_code}
            inviteCodeExpiresAt={activeSpace.invite_code_expires_at}
            spaces={spaces}
            onSwitchSpace={setActiveSpaceId}
            onCreateSpace={createSpace}
            onJoinSpace={joinSpace}
            onRegenerateInviteCode={regenerateInviteCode}
            onRenameSpace={renameSpace}
            onSignOut={signOut}
          />
        )}
      </main>

      <BottomTabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}
