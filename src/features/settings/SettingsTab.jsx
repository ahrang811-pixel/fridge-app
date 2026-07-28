import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { CategoryManager } from './CategoryManager'
import { ChangePasswordForm } from './ChangePasswordForm'
import { FontPicker } from './FontPicker'
import { MealTypeSettings } from './MealTypeSettings'
import { SpaceSettings } from './SpaceSettings'
import { useSpaceSettings } from './useSpaceSettings'
import { DEFAULT_FONT_ID, FALLBACK_CATEGORY, SETTINGS_KEYS } from './defaults'

const SECTIONS = [
  {
    id: 'space',
    icon: '🏠',
    label: '스페이스',
    description: '초대 코드 확인, 스페이스 전환/추가',
  },
  {
    id: 'ingredientCategories',
    icon: '🥬',
    label: '식재료 카테고리',
    description: '식재료 목록 탭에서 사용할 카테고리를 관리합니다.',
  },
  {
    id: 'mealTypes',
    icon: '📅',
    label: '식단 짜기 끼니',
    description: '실제로 사용할 끼니만 선택합니다.',
  },
  {
    id: 'recipeCategories',
    icon: '📖',
    label: '레시피 카테고리',
    description: '레시피 탭에서 사용할 카테고리(폴더)를 관리합니다.',
  },
  {
    id: 'font',
    icon: '🔤',
    label: '폰트',
    description: '앱 전체에 적용할 폰트를 선택합니다.',
  },
  {
    id: 'account',
    icon: '🔒',
    label: '계정',
    description: '비밀번호를 변경합니다.',
  },
]

export function SettingsTab({
  spaceId,
  spaceName,
  inviteCode,
  inviteCodeExpiresAt,
  spaces,
  onSwitchSpace,
  onCreateSpace,
  onJoinSpace,
  onRegenerateInviteCode,
  onRenameSpace,
  onLeaveSpace,
  onSignOut,
}) {
  const [section, setSection] = useState(null)

  const {
    ingredientCategories,
    recipeCategories,
    mealTypes,
    updateIngredientCategories,
    updateRecipeCategories,
    updateMealTypes,
  } = useSpaceSettings(spaceId)

  const [fontId, setFontId] = useLocalStorage(
    SETTINGS_KEYS.font,
    DEFAULT_FONT_ID,
  )

  const renameIngredientCategory = async (oldName, newName) => {
    await updateIngredientCategories(
      ingredientCategories.map((c) => (c === oldName ? newName : c)),
    )
    await supabase
      .from('ingredients')
      .update({ category: newName })
      .eq('space_id', spaceId)
      .eq('category', oldName)
  }

  const deleteIngredientCategory = async (name) => {
    await updateIngredientCategories(
      ingredientCategories.filter((c) => c !== name),
    )
    await supabase
      .from('ingredients')
      .update({ category: FALLBACK_CATEGORY })
      .eq('space_id', spaceId)
      .eq('category', name)
  }

  const addIngredientCategory = (name) =>
    updateIngredientCategories([...ingredientCategories, name])

  const renameRecipeCategory = async (oldName, newName) => {
    await updateRecipeCategories(
      recipeCategories.map((c) => (c === oldName ? newName : c)),
    )
    await supabase
      .from('recipes')
      .update({ category: newName })
      .eq('space_id', spaceId)
      .eq('category', oldName)
  }

  const deleteRecipeCategory = async (name) => {
    await updateRecipeCategories(recipeCategories.filter((c) => c !== name))
    await supabase
      .from('recipes')
      .update({ category: FALLBACK_CATEGORY })
      .eq('space_id', spaceId)
      .eq('category', name)
  }

  const addRecipeCategory = (name) =>
    updateRecipeCategories([...recipeCategories, name])

  const toggleMealType = (id) => {
    const enabledCount = mealTypes.filter((m) => m.enabled).length
    const next = mealTypes.map((m) => {
      if (m.id !== id) return m
      if (m.enabled && enabledCount === 1) return m
      return { ...m, enabled: !m.enabled }
    })
    updateMealTypes(next)
  }

  if (!section) {
    return (
      <div className="flex flex-col gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50"
          >
            <span className="text-xl">{s.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{s.label}</p>
              <p className="mt-0.5 truncate text-xs text-gray-400">
                {s.description}
              </p>
            </div>
            <span className="shrink-0 text-gray-300">›</span>
          </button>
        ))}

        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-center text-xs text-gray-400 hover:text-gray-600"
        >
          개인정보처리방침
        </a>
      </div>
    )
  }

  const current = SECTIONS.find((s) => s.id === section)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSection(null)}
          className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
        >
          ‹ 설정
        </button>
        <h2 className="text-sm font-semibold text-gray-900">
          {current.icon} {current.label}
        </h2>
      </div>

      {section === 'space' && (
        <SpaceSettings
          spaceId={spaceId}
          spaceName={spaceName}
          inviteCode={inviteCode}
          inviteCodeExpiresAt={inviteCodeExpiresAt}
          spaces={spaces}
          onSwitchSpace={onSwitchSpace}
          onCreateSpace={onCreateSpace}
          onJoinSpace={onJoinSpace}
          onRegenerateInviteCode={onRegenerateInviteCode}
          onRenameSpace={onRenameSpace}
          onLeaveSpace={onLeaveSpace}
        />
      )}

      {section === 'ingredientCategories' && (
        <CategoryManager
          categories={ingredientCategories}
          protectedCategory={FALLBACK_CATEGORY}
          onAdd={addIngredientCategory}
          onRename={renameIngredientCategory}
          onDelete={deleteIngredientCategory}
        />
      )}

      {section === 'mealTypes' && (
        <MealTypeSettings mealTypes={mealTypes} onToggle={toggleMealType} />
      )}

      {section === 'recipeCategories' && (
        <CategoryManager
          categories={recipeCategories}
          protectedCategory={FALLBACK_CATEGORY}
          onAdd={addRecipeCategory}
          onRename={renameRecipeCategory}
          onDelete={deleteRecipeCategory}
        />
      )}

      {section === 'font' && (
        <FontPicker fontId={fontId} onSelect={setFontId} />
      )}

      {section === 'account' && (
        <div className="flex flex-col gap-4">
          <ChangePasswordForm />
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="self-start rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            >
              로그아웃
            </button>
          )}
        </div>
      )}
    </div>
  )
}
