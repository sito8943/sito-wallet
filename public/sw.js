const buildId = new URL(self.location.href).searchParams.get("build") || "dev";
const cachePrefix = "sito-wallet-runtime";
const cacheName = `${cachePrefix}-${buildId}`;
const appShellAssets = [
  "/",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      await Promise.all(
        appShellAssets.map(async (assetUrl) => {
          try {
            await cache.add(assetUrl);
          } catch {}
        }),
      );
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(cachePrefix) && key !== cacheName)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "SKIP_WAITING") return;
  void self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(
        (response) => {
          const responseClone = response.clone();
          void caches.open(cacheName).then((cache) => {
            void cache.put("/", responseClone);
          });
          return response;
        },
        async () => {
          const cachedResponse = await caches.match("/");
          return cachedResponse || Response.error();
        },
      ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      if (cachedResponse) {
        void fetch(request)
          .then((response) => {
            if (!response.ok) return response;

            const responseClone = response.clone();
            void caches.open(cacheName).then((cache) => {
              void cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {});

        return cachedResponse;
      }

      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        void caches.open(cacheName).then((cache) => {
          void cache.put(request, responseClone);
        });
      }

      return networkResponse;
    }),
  );
});
