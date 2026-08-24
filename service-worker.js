const CACHE = 'sumer-rest-pwa-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Never cache Supabase/API/auth traffic: stock data must stay live.
  if (url.pathname.includes('/rest/') ||
      url.pathname.includes('/auth/') ||
      url.hostname.includes('supabase.co')) {
    return;
  }

  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(response => {
        const copy = response.clone();
        if (response.ok && url.origin === self.location.origin) {
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
