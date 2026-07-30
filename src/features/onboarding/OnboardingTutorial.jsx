import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../auth/AuthContext'
import { ONBOARDING_STEPS } from './onboardingSteps'

// 행이 있으면 "봤음"으로 취급한다. 로그인 직후(회원가입 후 첫 로그인 포함)
// 이 행이 없는 사용자에게만 튜토리얼을 자동으로 보여준다.
export function OnboardingTutorial() {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false

    supabase
      .from('user_onboarding')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && !data) setVisible(true)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const persistDismissal = () => {
    supabase
      .from('user_onboarding')
      .upsert({ user_id: user.id }, { onConflict: 'user_id' })
  }

  const handleSkip = () => {
    if (dontShowAgain) persistDismissal()
    setVisible(false)
  }

  const handleNext = () => {
    const isLast = stepIndex === ONBOARDING_STEPS.length - 1
    if (!isLast) {
      setStepIndex((i) => i + 1)
      return
    }
    persistDismissal()
    setVisible(false)
  }

  if (!visible) return null

  const step = ONBOARDING_STEPS[stepIndex]
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex w-full max-w-sm flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-8 text-center">
          <span className="text-4xl" aria-hidden="true">
            {step.icon}
          </span>
          <h2 className="text-base font-semibold text-gray-900">{step.title}</h2>

          {step.description && (
            <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
          )}

          {step.items && (
            <ul className="flex w-full flex-col gap-2 text-left">
              {step.items.map((item) => (
                <li key={item.title} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-800">
                    {item.icon} {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-4">
          {ONBOARDING_STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === stepIndex ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-5 py-4">
          <label className="flex shrink-0 items-center gap-1.5 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            다시 보지 않기
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-100"
            >
              건너뛰기
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {isLast ? '시작하기' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
