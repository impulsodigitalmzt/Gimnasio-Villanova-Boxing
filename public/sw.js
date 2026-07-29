/**
 * Service worker mínimo de Villanova Boxing.
 * Solo habilita la instalación como app (PWA); no cachea respuestas para evitar
 * servir chunks viejos de /_next tras cada despliegue.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});
