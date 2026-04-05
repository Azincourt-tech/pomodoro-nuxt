// Service Worker para Push Notifications
// Este arquivo é processado separadamente pelo Vite PWA plugin

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// Precache and route
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Cache page navigations
const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
  allowlist: [/^\/$/],
})
registerRoute(navigationRoute)

clientsClaim()

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'Pomodoro Move.it', body: event.data.text() }
  }

  const title = data.title || 'Pomodoro Move.it'
  const options = {
    body: data.body || 'Você tem uma notificação',
    icon: data.icon || '/icons/pwa-192x192.png',
    badge: data.badge || '/icons/pwa-192x192.png',
    tag: data.tag || 'pomodoro-notification',
    data: data.data || {},
    actions: data.actions || [],
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/')
      }
    })
  )
})
