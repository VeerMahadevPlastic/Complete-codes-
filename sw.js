const CACHE_NAME = 'veer-mahadev-app-v7';
const ASSETS = [
  './',
  './index.html',
  './my-orders.html',
  './vmp-admin.html',
  './vmp-admin',
  './live-tracking.html',
  './shipping-returns.html',
  './terms-conditions.html',
  './privacy-policy.html',
  './refund-policy.html',
  './manifest.json',
  './sw.js',
  './icons/logo.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './images/plate.jpg',
  './wholesale-price-list.pdf',
  './last-rates.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  if (requestUrl.pathname.endsWith('/last-rates.json')) {
    event.respondWith(
      caches.match('./last-rates.json').then((cached) => cached || fetch('./last-rates.json'))
    );
    return;
  }

  const isHtmlRequest = event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html');
  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
