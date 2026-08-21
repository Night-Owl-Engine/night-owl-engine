const CACHE_NAME = "night-owl-engine-v1";
const ASSETS = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type !== "NIGHT_OWL_NOTIFY") return;
  self.registration.showNotification(data.title || "Night Owl Engine", {
    body: data.body || "",
    tag: data.tag || "night-owl",
    renotify: true,
    icon: "icon-192.png",
    badge: "icon-192.png",
    vibrate: [200, 80, 200],
    requireInteraction: false,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      const existing = clientsArr.find((c) => "focus" in c);
      if (existing) return existing.focus();
      return self.clients.openWindow("./index.html");
    })
  );
});