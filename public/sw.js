const CACHE_NAME = 'eos-menu-sync-v2'
const CORE_ASSETS = [
  '/',
  '/kosher-launcher',
  '/manifest.webmanifest',
  '/menu-syncscreen',
  '/app.js',
  '/styles.css',
  '/menu-main-1.json',
  '/menu-main-2.json',
  '/menu-main-3.json',
  '/menu-sushi-1.json',
  '/menu-sushi-2.json',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    })
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) {
    return
  }

  const isMenuApi = requestUrl.pathname === '/api/menu' || requestUrl.pathname === '/api/screen-state'
  const isMenuAsset = requestUrl.pathname.startsWith('/menu-') || requestUrl.pathname === '/app.js' || requestUrl.pathname === '/styles.css'

  if (isMenuApi || isMenuAsset) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(async () => {
          const cached = await caches.match(event.request)
          if (cached) {
            return cached
          }
          return new Response(JSON.stringify({ success: false, error: 'Offline and not cached' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
          })
        })
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached
      }

      return fetch(event.request)
        .then(networkResponse => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => caches.match('/'))
    })
  )
})
