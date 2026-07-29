import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// 유통기한 임박 알림 등, 서버(웹 푸시)가 보낸 알림을 실제 화면에 띄운다.
self.addEventListener('push', (event) => {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = { body: event.data ? event.data.text() : '' }
  }

  const title = payload.title || '공유 냉장고'
  const options = {
    body: payload.body || '',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: { url: payload.url || '/app' },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// 알림을 누르면 이미 열려 있는 탭이 있으면 그 탭으로, 없으면 새 탭으로 이동한다.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/app'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const existing = clientList.find((client) => client.url.includes(url))
        if (existing) return existing.focus()
        return self.clients.openWindow(url)
      }),
  )
})
