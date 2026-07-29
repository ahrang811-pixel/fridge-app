// VAPID 공개키는 base64url 문자열로 배포되므로, PushManager.subscribe가 요구하는
// Uint8Array 형태로 변환해야 한다. (Web Push 표준 예제에서 흔히 쓰이는 변환 방식)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function isPushSupported() {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  )
}

export async function getExistingSubscription() {
  if (!isPushSupported()) return null
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

export async function subscribeToPush(vapidPublicKey) {
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  })
}

export function toSubscriptionRow(subscription, userId) {
  const json = subscription.toJSON()
  return {
    user_id: userId,
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth_key: json.keys.auth,
  }
}
