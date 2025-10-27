const CACHE_NAME = 'checklist-v2';
const urlsToCache = [
  'index.html',
  'service-worker.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/html5-qrcode',
  // Es recomendable añadir la fuente de Google aquí también
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened, adding URLs');
      // Usamos addAll que es transaccional. Si uno falla, fallan todos.
      return cache.addAll(urlsToCache).catch(err => {
        console.error('Failed to cache URLs during install:', err);
        // Opcional: podrías querer re-intentar o manejar URLs individuales
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Solo manejamos peticiones GET
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
      return fetch(event.request).then((networkResponse) => {
          // 2a. Opcional: Podrías clonar y guardar la respuesta en caché aquí si quisieras
          //     para peticiones que no estaban en el 'urlsToCache' inicial.
          //     Por ahora, solo la retornamos.
          return networkResponse;
        }).catch(err => {
          console.error('Network fetch failed:', err);
          // Opcional: Retornar una página "offline" genérica si falla la red
          // y no estaba en caché.
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
