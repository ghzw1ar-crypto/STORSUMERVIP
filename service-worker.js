const CACHE = 'sumer-rest-pwa-v2';

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
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // لا نخزن Supabase/API/auth
  if (
    url.pathname.includes('/rest/') ||
    url.pathname.includes('/auth/') ||
    url.hostname.includes('supabase.co')
  ) {
    return;
  }

  if (req.method !== 'GET') return;

  // جلب index.html من الشبكة أولاً
  const isAppShell =
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/STORSUMERVIP/') ||
    url.pathname.endsWith('/STORSUMERVIP');

  if (isAppShell) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(req, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(req).then(
            cached => cached || caches.match('./index.html')
          )
        )
    );
    return;
  }

  // باقي الملفات: الكاش أولاً ثم الشبكة
  event.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(response => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
