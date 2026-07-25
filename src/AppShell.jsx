import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAuth } from './features/auth/AuthContext'
import { useSpace } from './features/space/SpaceContext'
import { SpaceOnboarding } from './features/space/SpaceOnboarding'
import { IngredientsTab } from './features/ingredients/IngredientsTab'
import { ShoppingTab } from './features/shopping/ShoppingTab'
import { MealPlanTab } from './features/mealplan/MealPlanTab'
import { ExpensesTab } from './features/expenses/ExpensesTab'
import { RecipesTab } from './features/recipes/RecipesTab'
import { SettingsTab } from './features/settings/SettingsTab'
import {
  DEFAULT_FONT_ID,
  FONT_OPTIONS,
  SETTINGS_KEYS,
} from './features/settings/defaults'

const TABS = [
  { id: 'ingredients', label: '식재료 목록', icon: '🥬' },
  { id: 'shopping', label: '장보기 목록', icon: '🛒' },
  { id: 'mealplan', label: '식단 짜기', icon: '📅' },
  { id: 'expenses', label: '식비 정리', icon: '💰' },
  { id: 'recipes', label: '레시피', icon: '📖' },
  { id: 'settings', label: '설정', icon: '⚙️' },
]

function LoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-gray-50 text-sm text-gray-400">
      불러오는 중…
    </div>
  )
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState('ingredients')
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
    <div
      className="flex min-h-svh flex-col bg-gray-50 sm:flex-row"
      style={{ fontFamily }}
    >
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        spaceName={activeSpace.name}
        onSignOut={signOut}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8">
        {activeTab === 'ingredients' && (
          <IngredientsTab spaceId={activeSpace.id} />
        )}
        {activeTab === 'shopping' && <ShoppingTab spaceId={activeSpace.id} />}
        {activeTab === 'mealplan' && <MealPlanTab spaceId={activeSpace.id} />}
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'recipes' && <RecipesTab spaceId={activeSpace.id} />}
        {activeTab === 'settings' && (
          <SettingsTab
            spaceId={activeSpace.id}
            spaceName={activeSpace.name}
            inviteCode={activeSpace.invite_code}
            spaces={spaces}
            onSwitchSpace={setActiveSpaceId}
            onCreateSpace={createSpace}
            onJoinSpace={joinSpace}
          />
        )}
      </main>
    </div>
  )
}
