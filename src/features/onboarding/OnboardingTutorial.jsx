import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { ONBOARDING_STEPS } from './onboardingSteps'
import { hasSeenOnboarding, markOnboardingSeen } from './onboardingSession'

// 로그인 세션(sessionStorage) 기준으로 한 번만 보여준다. 같은 세션에서
// 새로고침해도 다시 뜨지 않지만, 로그아웃(AuthContext의 signOut)하면
// 플래그가 지워져 다음 로그인 때 다시 뜬다. 탭을 닫아도 sessionStorage가
// 사라지므로 다음에 열면 다시 뜬다.
export function OnboardingTutorial() {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!user || hasSeenOnboarding()) return
    markOnboardingSeen()
    setVisible(true)
  }, [user])

  const handleSkip = () => {
    setVisible(false)
  }

  const handleNext = () => {
    const isLast = stepIndex === ONBOARDING_STEPS.length - 1
    if (!isLast) {
      setStepIndex((i) => i + 1)
      return
    }
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
            <div className="flex flex-col gap-2">
              {step.description.map((paragraph, i) => (
                <p
                  key={i}
                  className="break-keep text-sm leading-relaxed text-gray-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {step.items && (
            <ul className="flex w-full flex-col gap-2 text-left">
              {step.items.map((item) => (
                <li key={item.title} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-800">
                    {item.icon} {item.title}
                  </p>
                  <p className="mt-0.5 break-keep text-xs leading-relaxed text-gray-500">
                    {item.description}
                  </p>
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

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
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
  )
}
