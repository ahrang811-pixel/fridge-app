import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import {
  getExistingSubscription,
  isPushSupported,
  subscribeToPush,
  toSubscriptionRow,
} from './pushSubscription'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY
const DEFAULT_NOTIFY_HOUR = 9

// 오전 7시 ~ 오후 9시, 1시간 단위
const NOTIFY_HOUR_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 7)

function formatHourLabel(hour) {
  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${period} ${displayHour}시`
}

export function NotificationSettings() {
  const { user } = useAuth()
  const [supported] = useState(() => isPushSupported())
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [notifyHour, setNotifyHour] = useState(DEFAULT_NOTIFY_HOUR)
  const [hourError, setHourError] = useState(null)

  useEffect(() => {
    if (!supported) {
      setLoading(false)
      return
    }
    getExistingSubscription()
      .then((sub) => setSubscribed(!!sub))
      .finally(() => setLoading(false))
  }, [supported])

  useEffect(() => {
    if (!user) return
    supabase
      .from('notification_settings')
      .select('notify_hour')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.notify_hour != null) setNotifyHour(data.notify_hour)
      })
  }, [user])

  const handleEnable = async () => {
    setError(null)
    setBusy(true)
    try {
      if (!VAPID_PUBLIC_KEY) {
        throw new Error('알림 기능이 아직 설정되지 않았어요.')
      }

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setError(
          '알림 권한이 허용되지 않았어요. 브라우저 설정에서 알림을 허용해주세요.',
        )
        return
      }

      const subscription = await subscribeToPush(VAPID_PUBLIC_KEY)
      const { error: dbError } = await supabase
        .from('push_subscriptions')
        .upsert(toSubscriptionRow(subscription, user.id), {
          onConflict: 'endpoint',
        })
      if (dbError) throw dbError

      setSubscribed(true)
    } catch (err) {
      setError(err.message || '알림 등록 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const handleDisable = async () => {
    setError(null)
    setBusy(true)
    try {
      const subscription = await getExistingSubscription()
      if (subscription) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint)
        await subscription.unsubscribe()
      }
      setSubscribed(false)
    } catch (err) {
      setError(err.message || '알림 해제 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const handleHourChange = async (e) => {
    const hour = Number(e.target.value)
    const prevHour = notifyHour
    setNotifyHour(hour)
    setHourError(null)
    const { error: dbError } = await supabase
      .from('notification_settings')
      .upsert(
        { user_id: user.id, notify_hour: hour },
        { onConflict: 'user_id' },
      )
    if (dbError) {
      setNotifyHour(prevHour)
      setHourError('알림 시간 저장 중 오류가 발생했습니다.')
    }
  }

  if (!supported) {
    return (
      <p className="text-sm text-gray-500">
        이 브라우저는 알림 기능을 지원하지 않아요.
      </p>
    )
  }

  if (loading) {
    return <p className="text-sm text-gray-400">확인하는 중…</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-gray-600">
        유통기한이 3일 이내로 임박한 식재료가 있으면 선택한 시간에 알림을
        보내드려요.
      </p>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        알림 받을 시간
        <select
          value={notifyHour}
          onChange={handleHourChange}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {NOTIFY_HOUR_OPTIONS.map((hour) => (
            <option key={hour} value={hour}>
              {formatHourLabel(hour)}
            </option>
          ))}
        </select>
      </label>

      {hourError && <p className="text-xs text-red-500">{hourError}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {subscribed ? (
        <button
          type="button"
          onClick={handleDisable}
          disabled={busy}
          className="self-start rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? '처리하는 중…' : '🔕 알림 끄기'}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleEnable}
          disabled={busy}
          className="self-start rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? '처리하는 중…' : '🔔 알림 받기'}
        </button>
      )}
    </div>
  )
}
