const CACHE_NAME = 'checklist-v3';
const RUNTIME_CACHE = 'runtime-cache-v3';
const urlsToCache = [
  './index.html',
  './',
  './manifest.json'
];

// CDN resources to cache on demand
const CDN_CACHE = 'cdn-cache-v3';
const cdnResources = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/html5-qrcode'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker v3 installing.');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('Cache install failed:', error))
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker v3 activating.');
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => {
      if (![CACHE_NAME, RUNTIME_CACHE, CDN_CACHE].includes(cacheName)) {
        console.log('Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      }
      return Promise.resolve();
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy: Network First for HTML, Cache First for CDN resources
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    // Network first for HTML
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
  } else if (cdnResources.some(cdn => request.url.includes(cdn))) {
    // Cache first for CDN resources
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((response) => {
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CDN_CACHE).then((cache) => cache.put(request, clonedResponse));
          }
          return response;
        });
      }).catch(() => new Response('Offline - CDN resource unavailable', {
        status: 503,
        statusText: 'Service Unavailable'
      }))
    );
  } else {
    // Default: Cache first, then network
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            if (request.method === 'GET') {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      }).catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }))
    );
  }
});

// Permitir que el cliente envíe mensaje para forzar skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
