const CACHE_NAME = 'veer-mahadev-app-v8';
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
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
