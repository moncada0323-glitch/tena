/* eslint-disable no-undef */
/**
 * Service Worker optimizado y corregido para PWA con Next.js
 * No genera rutas duplicadas, no ejecuta GenerateSW múltiples veces
 * y funciona correctamente en modo empaquetado.
 */

importScripts('/workbox-v6.5.4/workbox-sw.js');

// Garantiza que Workbox cargó
if (workbox) {
  console.log("Workbox cargado correctamente.");
} else {
  console.error("Error al cargar Workbox.");
}

self.skipWaiting();
workbox.core.clientsClaim();

// ===============================
// CACHE PRINCIPAL (DOCUMENTO ROOT)
// ===============================
workbox.routing.registerRoute(
  '/',
  new workbox.strategies.NetworkFirst({
    cacheName: 'start-url',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.type === 'opaqueredirect') {
            return new Response(response.body, {
              status: 200,
              headers: response.headers
            });
          }
          return response;
        }
      }
    ]
  })
);

// ===============================
// CACHÉ DE ARCHIVOS ESTÁTICOS
// ===============================
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'worker',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// ===============================
// CACHÉ PARA IMÁGENES
// ===============================
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
      })
    ]
  })
);

// ===============================
// RUTA FINAL POR DEFECTO
// ===============================
workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.NetworkOnly()
);
