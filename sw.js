// Offline cache: the whole app is stored on the phone at install. Bump VERSION when any file changes.
const VERSION = "flippad-v1";
const FILES = [
  "./", "index.html", "fonts.css", "manifest.webmanifest",
  "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
  "fonts/Kalam-400.woff2", "fonts/Kalam-700.woff2",
  "fonts/AtkinsonHyperlegible-400.woff2", "fonts/AtkinsonHyperlegible-700.woff2",
  "fonts/IBMPlexMono-500.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache first, so the app opens instantly with no signal.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).catch(() =>
      e.request.mode === "navigate" ? caches.match("index.html") : Response.error()))
  );
});
