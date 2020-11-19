const cacheName = 'wb-v1';
const cacheAssets = [
    './index.html',
    './css/style.css',
    './js/storage.js',
    './js/devices.js',
    './js/ui.js',
    './js/app.js',
    './assets/whiteBerryPWA.png',
    './assets/whiteBerryPWAlight.png',
    './assets/manifest/whiteberry192x192.png',
    './assets/manifest/whiteberry512x512.png',
]

// install
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                cache.addAll(cacheAssets)
            })
            .then(() => {
                self.skipWaiting()
            })
    )
})

// activate
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        caches.delete(cache)
                    }
                })
            )
        })
    )
})

// fetch
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                return res || fetch(e.request)
            })
    )
}) 