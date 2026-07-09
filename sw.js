// Este archivo corre en segundo plano, incluso con la pantalla apagada.
self.addEventListener('push', function(event) {
    // Definimos el título y las opciones de la notificación en segundo plano
    const title = '¡Pizzas Roy!';
    const options = {
        body: '🍕 ¡Tu pizza está lista para retirar! Pasa a buscarla.',
        icon: 'icono.png', // Opcional: añade un icono si tienes uno
        badge: 'icono.png',
        // PATRÓN DE VIBRACIÓN: Vibra 500ms, pausa 250ms, vibra 500ms...
        vibrate: [500, 250, 500, 250, 500, 250, 500],
        data: {
            url: self.location.origin
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Si el usuario hace clic en la notificación, lo lleva a la app
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
