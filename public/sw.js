/* ═══════════════════════════════════════════════════════════
   رمضان هاب  —  Service Worker
   Cache strategy:
     • App shell       → Cache-first (pre-cached on install)
     • Local JSON data → Cache-first (cached on first fetch)
     • CDN / fonts     → Stale-while-revalidate
     • External APIs   → Network-first, fall back to cache
   ═══════════════════════════════════════════════════════════ */

const CACHE_VER   = 'ramadan-hub-v1';
const DATA_CACHE  = 'ramadan-data-v1';
const CDN_CACHE   = 'ramadan-cdn-v1';

/* Files to pre-cache immediately on install */
const SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
  '/quran/quran.json',
];

/* ── Install: pre-cache shell ────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VER)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: remove stale caches ───────────────────────── */
self.addEventListener('activate', event => {
  const KEEP = new Set([CACHE_VER, DATA_CACHE, CDN_CACHE]);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !KEEP.has(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch ───────────────────────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and chrome-extension requests */
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  /* ① External APIs — network-first, cache fallback */
  if (isExternalAPI(url)) {
    event.respondWith(networkFirst(request, CDN_CACHE));
    return;
  }

  /* ② CDN resources (Bootstrap, fonts, icons font) — stale-while-revalidate */
  if (isCDN(url)) {
    event.respondWith(staleWhileRevalidate(request, CDN_CACHE));
    return;
  }

  /* ③ Local JSON data (hadith / quran) — cache-first */
  if (isLocalData(url)) {
    event.respondWith(cacheFirst(request, DATA_CACHE));
    return;
  }

  /* ④ App shell — cache-first */
  event.respondWith(cacheFirst(request, CACHE_VER));
});

/* ── Helpers ─────────────────────────────────────────────── */

function isExternalAPI(url) {
  return url.hostname === 'api.aladhan.com';
}

function isCDN(url) {
  return (
    url.hostname === 'cdn.jsdelivr.net' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  );
}

function isLocalData(url) {
  return (
    url.pathname.includes('/hadithbangla/') ||
    url.pathname.includes('/quran/')
  );
}

/* Cache-first: serve from cache, fall back to network + add to cache */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    return new Response(
      JSON.stringify({ error: 'offline' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/* Network-first: try network, fall back to cache */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: 'offline' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/* Stale-while-revalidate: serve cache immediately, update in background */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(fresh => {
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  }).catch(() => null);

  return cached || fetchPromise;
}

/* ── Background sync: re-fetch prayer times on reconnect ─── */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
