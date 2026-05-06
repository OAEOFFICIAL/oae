const CACHE_NAME = 'oae-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/Assets/css/style.css',
  '/Assets/css/navbar.css',
  '/Assets/js/navbar.js',
  '/OAE.png'
];

// Install Event
self.addEventListener('install', event => {
  self.skipWaiting(); // Immediately activate new service worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => console.warn('PWA Cache error:', err));
      })
  );
});

// Activate Event (Clean up old caches)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old version caches
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all pages immediately
  );
});

// Fetch Event (Network First Strategy)
self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network fetch is successful, cache the latest version!
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails (offline), return the cached version!
        return caches.match(event.request);
      })
  );
});
