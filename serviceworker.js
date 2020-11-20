// static cache variable
const staticCacheName = 'st-v1';
// dynamic cache variable
const dynamicCacheName = 'dyn-v1';
// precache values
const cacheAssets = [
    '/',
    './index.html',
    './css/style.css',
    './pages/fallback.html',
    './assets/whiteBerryPWA.png',
    './assets/whiteBerryPWAlight.png'
]

// install
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(cacheAssets)
            })
    )
})

// activate
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== staticCacheName && cache !== dynamicCacheName ) {
                        return caches.delete(cache)
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
            .then((cacheRes) => {
                if(cacheRes) {
                    return cacheRes;
                }
                return fetch(e.request)
                    .then(fetchRes => {
                        return caches.open(dynamicCacheName).then(cache => {
                            cache.put(e.request.url, fetchRes.clone());
                            return fetchRes;
                        })
                    })
                    .catch(err => {
                        const isHTMLPage = e.request.method == "GET" && e.request.headers.get('accept').includes('text/html');
                        if(isHTMLPage) {
                            return caches.match('./pages/fallback.html')
                        }
                    })
            })
    )
}) 