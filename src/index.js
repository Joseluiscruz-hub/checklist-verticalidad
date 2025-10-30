addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Worker que proxy hacia el origen y añade cabeceras de seguridad.
 * Origin por defecto: https://joseluiscruz.me
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  // For testing on workers.dev, forward to the GitHub Pages origin
  const origin = 'https://joseluiscruz.me';
  const targetUrl = origin + url.pathname + url.search;

  const fetchReq = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'manual',
  });

  const res = await fetch(fetchReq);

  // Clone response to modify headers
  const newHeaders = new Headers(res.headers);

  // Security headers to inject
  newHeaders.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'no-referrer-when-downgrade');
  newHeaders.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  // Example CSP; adjust as needed
  newHeaders.set(
    'Content-Security-Policy',
    "default-src 'self' https://ajax.googleapis.com https://cdnjs.cloudflare.com; img-src * data:; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://ajax.googleapis.com;"
  );

  // Return response with modified headers and same status
  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
}
