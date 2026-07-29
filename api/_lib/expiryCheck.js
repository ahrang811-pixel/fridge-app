import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function formatExpiryMessage(names) {
  if (names.length <= 2) {
    return `${names.join(', ')} 유통기한이 임박했어요!`
  }
  return `${names.slice(0, 2).join(', ')} 등 ${names.length}개 재료의 유통기한이 임박했어요!`
}

function getServiceRoleClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

const DEFAULT_NOTIFY_HOUR = 9

// KST(UTC+9) 기준 현재 정시(0~23)를 구한다. Vercel Cron은 매시 정각(UTC 기준)에
// 호출되므로, 이 값과 사용자가 설정한 notify_hour가 같을 때만 알림을 보낸다.
function getCurrentKstHour() {
  return (new Date().getUTCHours() + 9) % 24
}

// 유통기한이 오늘부터 3일 이내인 식재료가 있는 스페이스를 찾아, 그 스페이스에
// 속한 구성원 중 지금 이 시간을 알림 시간으로 설정한 사람에게만 웹 푸시
// 알림을 보낸다. 매시 정각(Vercel Cron)에 호출되는 것을 전제로 한다.
export async function runExpiryCheck() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.')
  }
  if (!process.env.VAPID_PRIVATE_KEY || !process.env.VITE_VAPID_PUBLIC_KEY) {
    throw new Error('VAPID 키가 설정되지 않았습니다.')
  }

  webpush.setVapidDetails(
    'mailto:ahrang811@gmail.com',
    process.env.VITE_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )

  const supabase = getServiceRoleClient()

  const today = new Date()
  const later = new Date(today)
  later.setUTCDate(later.getUTCDate() + 3)

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('space_id, name, expiry_date')
    .gte('expiry_date', toDateKey(today))
    .lte('expiry_date', toDateKey(later))

  if (ingredientsError) throw ingredientsError

  const namesBySpace = new Map()
  for (const row of ingredients ?? []) {
    const names = namesBySpace.get(row.space_id) ?? new Set()
    names.add(row.name)
    namesBySpace.set(row.space_id, names)
  }

  const spaceIds = [...namesBySpace.keys()]
  if (spaceIds.length === 0) {
    return { spacesChecked: 0, notificationsSent: 0, currentHour: getCurrentKstHour() }
  }

  const { data: members, error: membersError } = await supabase
    .from('space_members')
    .select('space_id, user_id')
    .in('space_id', spaceIds)

  if (membersError) throw membersError

  const userIds = [...new Set((members ?? []).map((m) => m.user_id))]

  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('push_subscriptions')
    .select('id, user_id, endpoint, p256dh, auth_key')
    .in('user_id', userIds)

  if (subscriptionsError) throw subscriptionsError

  const { data: settings, error: settingsError } = await supabase
    .from('notification_settings')
    .select('user_id, notify_hour')
    .in('user_id', userIds)

  if (settingsError) throw settingsError

  const notifyHourByUser = new Map(
    (settings ?? []).map((s) => [s.user_id, s.notify_hour]),
  )

  const subscriptionsByUser = new Map()
  for (const sub of subscriptions ?? []) {
    const list = subscriptionsByUser.get(sub.user_id) ?? []
    list.push(sub)
    subscriptionsByUser.set(sub.user_id, list)
  }

  const currentHour = getCurrentKstHour()
  let notificationsSent = 0
  const staleSubscriptionIds = new Set()

  for (const member of members ?? []) {
    const names = namesBySpace.get(member.space_id)
    const userSubscriptions = subscriptionsByUser.get(member.user_id)
    if (!names || !userSubscriptions?.length) continue

    const notifyHour = notifyHourByUser.get(member.user_id) ?? DEFAULT_NOTIFY_HOUR
    if (notifyHour !== currentHour) continue

    const payload = JSON.stringify({
      title: '유통기한 임박 알림',
      body: formatExpiryMessage([...names]),
      url: '/app',
    })

    for (const sub of userSubscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth_key },
          },
          payload,
        )
        notificationsSent += 1
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          staleSubscriptionIds.add(sub.id)
        }
      }
    }
  }

  if (staleSubscriptionIds.size > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .in('id', [...staleSubscriptionIds])
  }

  return { spacesChecked: spaceIds.length, notificationsSent, currentHour }
}
