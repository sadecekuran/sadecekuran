const CACHE_NAME = "ana-ekran-app-v1"
const urlsToCache = ["/", "/appp.html", "/manifest.json", "/icon-192x192.png", "/icon-512x512.png"]

// Yükleme sırasında kaynakları önbelleğe al
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Önbellek açıldı")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Ağ isteklerini yakala ve önbellekten yanıt ver
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Önbellekte varsa, önbellekten döndür
      if (response) {
        return response
      }

      // Önbellekte yoksa, ağdan al ve önbelleğe ekle
      return fetch(event.request).then((response) => {
        // Geçersiz yanıt veya opaque yanıt ise önbelleğe ekleme
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response
        }

        // Yanıtın bir kopyasını önbelleğe ekle
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

// Eski önbellekleri temizle
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
