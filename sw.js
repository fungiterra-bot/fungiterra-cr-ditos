// Préstamos: primero la red, para que los montos y la app siempre estén al día. Borra el caché de la app anterior.
const CACHE = 'fungiterra-prestamos-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r && r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
