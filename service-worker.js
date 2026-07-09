const CACHE_NAME = 'pizzas-roy-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './diseno.css',
  './icono-pizza.png',
  './AW.jpg',
  './pizza.png',
  './notifications.js',
  './notification-sound.mp3'
];

// INSTALACIÓN
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache abierto:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('[Service Worker] Error en cache:', err))
  );
  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Borrando cache viejo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH - Estrategia Cache First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            console.log('[Service Worker] Fetch fallido, usando cache');
            return caches.match('./index.html');
          });
      })
  );
});

// NOTIFICACIONES EN SEGUNDO PLANO
self.addEventListener('push', event => {
  console.log('[Service Worker] Push recibido:', event);
  
  let notificationData = {
    title: '🍕 Pizzas Roy - Pedido Listo',
    options: {
      body: 'Un pedido está listo para ser entregado',
      icon: 'icono-pizza.png',
      badge: 'icono-pizza.png',
      tag: 'pizza-notification',
      requireInteraction: true,
      vibrate: [300, 100, 300],
      actions: [
        { action: 'open', title: 'Abrir' },
        { action: 'close', title: 'Cerrar' }
      ]
    }
  };

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});

// CLICK EN NOTIFICACIÓN
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notificación clickeada:', event.action);
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('./');
          }
        })
    );
  }
});

// CIERRE DE NOTIFICACIÓN
self.addEventListener('notificationclose', event => {
  console.log('[Service Worker] Notificación cerrada');
});

// MENSAJE DESDE CLIENTE
self.addEventListener('message', event => {
  console.log('[Service Worker] Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
