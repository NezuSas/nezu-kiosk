/*
 * Service worker del kiosko: guarda la aplicación, las fuentes y las imágenes para que el tótem siga mostrando el
 * catálogo si se cae la red. Nunca toca las llamadas al servidor (/api, /socket.io): esas siempre van a la red.
 * El nombre de la caché cambia con cada build (lo sustituye scripts/build-demo.mjs o el despliegue) para que una
 * versión nueva reemplace a la anterior.
 */
const CACHE = "nezu-kiosk-mw9wb00n";
const SCOPE = self.registration.scope;

const isBypassed = (url) => url.pathname.includes("/api/") || url.pathname.includes("/socket.io/");
const isAsset = (url) => /\.(webp|avif|png|jpg|jpeg|svg|ttf|woff2?|css|js)$/.test(url.pathname);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([SCOPE])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isBypassed(url)) return;

  // Navegaciones: red primero y, sin red, la aplicación guardada (la SPA resuelve la ruta).
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(SCOPE, copy));
          return response;
        })
        .catch(() => caches.match(SCOPE).then((cached) => cached ?? Response.error()))
    );
    return;
  }

  // Imágenes, fuentes y código: caché primero, y lo que falte se guarda al pasar.
  if (isAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
  }
});
