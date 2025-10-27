const CACHE_NAME = 'checklist-v2';
// Ajustamos las rutas para que sean relativas
const urlsToCache = [
  './index.html',
  './manifest.json', // Añadido el manifest al caché
  './service-worker.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/html5-qrcode',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' // Añadida la fuente
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened, adding URLs');
      return cache.addAll(urlsToCache).catch(err => {
        console.error('Failed to cache URLs during install:', err);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Estrategia: Cache-First (Primero caché, luego red)
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. Si está en el caché, lo retornamos
      if (response) {
        return response;
      }

      // 2. Si no está en el caché, vamos a la red
      console.log('Fetching from network:', event.request.url);
      // Clonamos la petición porque la vamos a consumir dos veces (una para el caché, otra para el navegador)
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((networkResponse) => {
        // 2a. Si la respuesta es válida, la guardamos en caché y la retornamos
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          // No guardamos en caché respuestas de error o de tipo 'opaque' (como las de CDNs si CORS está mal)
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(err => {
        console.error('Network fetch failed:', err);
        // Opcional: Retornar una página "offline" genérica si falla la red
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Forzar al SW a tomar control inmediato
  return self.clients.claim();
});


