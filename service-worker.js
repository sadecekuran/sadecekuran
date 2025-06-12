self.addEventListener("install", function (e) {
  console.log("Service Worker yüklendi.");
});

self.addEventListener("fetch", function (e) {
  e.respondWith(fetch(e.request));
});
