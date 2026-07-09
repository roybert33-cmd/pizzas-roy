# 🍕 Pizzas Roy - Sistema de Notificaciones Avanzado

## 📋 Descripción de Cambios

Se han implementado **notificaciones avanzadas con vibración, sonido y reconexión automática** para mejorar la experiencia del usuario y la confiabilidad del sistema.

---

## ✨ Nuevas Características

### 1. 🔔 **Notificaciones en Segundo Plano**
- Notificaciones Web Push que se muestran incluso cuando la app está cerrada
- Service Worker mejorado con soporte para notificaciones de fondo
- Notificaciones persistentes que requieren interacción del usuario

**Archivos modificados:**
- `service-worker.js` - Manejo de eventos push
- `manifest.json` - Permisos de notificación

---

### 2. 📳 **Vibración Personalizada**
- Patrones de vibración diferentes según el tipo de evento:
  - **Nuevo pedido**: `[200, 50, 200, 50, 200, 50, 400]` (patrón especial)
  - **Error**: `[500, 100, 500]` (vibración más fuerte)
  - **Normal**: `[200, 100, 200]`

**Archivo:**
- `notifications.js` - Clase `NotificationManager` con método `triggerVibration()`

---

### 3. 🔊 **Sonido Mejorado**
- Reproducción de archivo de audio MP3 optimizado
- Fallback automático: Web Audio API si falla la reproducción del archivo
- Generación de tonos de alerta únicos usando síntesis de audio

**Características:**
- Volumen ajustable
- Múltiples tonos en secuencia
- Manejo de errores robusto

**Archivo:**
- `notifications.js` - Métodos `playNotificationSound()` y `playToneNotification()`

---

### 4. 🔄 **Reconexión Automática a Firebase**
- Estrategia de **backoff exponencial** para reintentos
- Máximo 10 intentos de reconexión
- Delay inicial de 1 segundo, aumentando exponencialmente
- Máximo delay de 30 segundos

**Lógica:**
```
Intento 1: 1 segundo
Intento 2: 2 segundos
Intento 3: 4 segundos
Intento 4: 8 segundos
...hasta 30 segundos máximo
```

**Archivo:**
- `notifications.js` - Método `reconnectWithBackoff()`

---

### 5. 📱 **PWA Mejorado**
- `manifest.json` actualizado con:
  - Shortcuts de acceso rápido
  - Screenshots para app stores
  - Categorías de aplicación
  - Share Target API
  - Múltiples tamaños de iconos

- `service-worker.js` mejorado con:
  - Cache v2 con más archivos
  - Estrategia Cache-First + Network Fallback
  - Manejo de mensajes desde el cliente
  - Soporte para actualización de worker

---

### 6. 📊 **Indicador de Estado de Conexión**
- Punto de estado en la esquina superior derecha
- Verde pulsante: Conectado ✅
- Rojo pulsante: Desconectado ⚠️

---

## 🚀 Cómo Usar

### Inicializar Notificaciones
```javascript
// Ya se inicializa automáticamente en index.html
const notificationManager = new NotificationManager();
```

### Mostrar Notificaciones

#### Notificación de Pedido Listo
```javascript
notificationManager.notifyOrderReady(123); // Número de pedido
// Genera: Vibración + Sonido + Notificación + Toast
```

#### Notificación de Éxito
```javascript
notificationManager.notifySuccess('Operación completada');
```

#### Notificación de Error
```javascript
notificationManager.notifyError('Ha ocurrido un error');
```

#### Notificación Personalizada
```javascript
notificationManager.showNotification('Título', {
  body: 'Cuerpo del mensaje',
  icon: 'icono.png',
  tag: 'mi-notificacion',
  requireInteraction: true
});
```

### Vibración Directa
```javascript
notificationManager.triggerVibration([200, 100, 200]);
// [duración_vibración, pausa, duración_vibración]
```

### Sonido Directo
```javascript
notificationManager.playNotificationSound();
```

---

## 🔧 Configuración

### Habilitar/Deshabilitar Vibración
```javascript
notificationManager.vibrationEnabled = true; // o false
```

### Habilitar/Deshabilitar Sonido
```javascript
notificationManager.soundEnabled = true; // o false
```

### Cambiar Máximo de Intentos de Reconexión
```javascript
notificationManager.maxReconnectAttempts = 15;
```

### Cambiar Delay Base de Reconexión
```javascript
notificationManager.baseDelay = 2000; // 2 segundos
```

---

## 📱 Compatibilidad

| Feature | Navegadores |
|---------|------------|
| **Web Push API** | Chrome, Firefox, Edge, Safari (limitado) |
| **Vibration API** | La mayoría de navegadores móviles |
| **Web Audio API** | Todos los navegadores modernos |
| **Service Worker** | Chrome, Firefox, Edge, Safari 11.1+ |
| **Notification API** | Todos excepto Safari |

---

## 🧪 Testing

### Probar Notificaciones
1. Abre la app en dispositivo móvil
2. Haz clic en "AVISAR SIGUIENTE"
3. Deberías escuchar: Sonido + Vibración
4. Deberías ver: Notificación toast en pantalla

### Probar en Segundo Plano
1. Abre la app en dispositivo móvil
2. Cierra la app completamente
3. En Firebase, cambia `pizzas_roy/contador_diario` a un número > `ultimo_avisado`
4. Deberías recibir: Notificación push del sistema

### Probar Reconexión
1. Abre la app
2. Desactiva internet
3. Espera 5-30 segundos
4. Reactiva internet
5. La app debería reconectarse automáticamente

---

## 📦 Archivos Nuevos/Modificados

### Nuevos
- ✅ `notifications.js` - Sistema completo de notificaciones
- ✅ `README-NOTIFICACIONES.md` - Esta documentación

### Modificados
- ✅ `service-worker.js` - Mejorado con push notifications
- ✅ `manifest.json` - Actualizado con permisos y configuración
- ✅ `index.html` - Integración de notificaciones

---

## 🐛 Troubleshooting

### Las notificaciones no se muestran
1. Verifica que has dado permisos
2. Abre DevTools Console y busca errores
3. Recarga la página `Ctrl+Shift+R`

### Sin vibración
1. Asegúrate de estar en dispositivo móvil
2. Verifica que `notificationManager.vibrationEnabled = true`
3. Algunos navegadores requieren HTTPS

### Sin sonido
1. Verifica que el volumen del dispositivo está activo
2. Intenta reproducir otro audio
3. Revisa que `notification-sound.mp3` existe en `/public`

### No se reconecta
1. Revisa que Firebase está disponible
2. Abre DevTools Console para ver intentos
3. Verifica que `navigator.onLine` es `true`

---

## 📝 Notas de Desarrollo

- El sistema es totalmente compatible con offline-first
- Los permisos se solicitan automáticamente
- La reconexión es transparente para el usuario
- Los eventos de notificación se registran en console para debugging
- El audioContext se crea lazy para evitar problemas de autoplay

---

## 🎯 Próximas Mejoras

- [ ] Implementar Push Notifications real con backend
- [ ] Agregar sonidos personalizables por tipo de evento
- [ ] Dashboard de estadísticas de notificaciones
- [ ] Historial de notificaciones en la app
- [ ] Notificaciones de presencia en tiempo real

---

**Versión:** 2.0  
**Última actualización:** 2026-07-09  
**Autor:** Copilot
