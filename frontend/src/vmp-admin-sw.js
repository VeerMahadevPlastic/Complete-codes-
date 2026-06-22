const CACHE = 'vmp-admin-cache-v1';
const ASSETS = [
  './vmp-admin.html',
  './vmp-admin-manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './js/vmp-config.js',
  './js/ui.js',
  './js/auth.js',
  './js/tracking.js',
  './js/vmp-app.js',
  './js/vmp-modules.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
