const CACHE_NAME = 'hub-v8';
const ASSETS = [
  './',
  './index.html',
  './styles/main.css',
  './styles/app-windows.css',
  './scripts/main.js',
  './scripts/storage.js',
  './scripts/vfs.js',
  './scripts/extensions.js',
  './scripts/utils.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // Dynamically cache app scripts as they are requested
        if (e.request.url.includes('/scripts/apps/')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});
