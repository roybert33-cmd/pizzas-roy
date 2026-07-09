# 🍕 Pizzas Roy - Sistema de Notificaciones Avanzado

## 📋 Descripción de Cambios

Se han implementado **notificaciones avanzadas con vibración, sonido y reconexión automática** para mejorar la experiencia del usuario y la confiabilidad del sistema.

---

## ✨ Nuevas Características

### 1. 🔔 **Notificaciones en Segundo Plano**
- Notificaciones Web Push que se muestran incluso cuando la app está cerrada
- Service Worker mejorado con soporte para notificaciones de fondo
- Notificaciones persistentes que requieren interacción del usuario

### 2. 📳 **Vibración Personalizada**
- Patrones de vibración diferentes según el tipo de evento:
  - **Nuevo pedido**: `[200, 50, 200, 50, 200, 50, 400]` (patrón especial)
  - **Error**: `[500, 100, 500]` (vibración más fuerte)
  - **Normal**: `[200, 100, 200]`

### 3. 🔊 **Sonido Mejorado**
- Reproducción de archivo de audio MP3 optimizado
- Fallback automático: Web Audio API si falla la reproducción del archivo
- Generación de tonos de alerta únicos usando síntesis de audio

### 4. 🔄 **Reconexión Automática a Firebase**
- Estrategia de **backoff exponencial** para reintentos
- Máximo 10 intentos de reconexión
- Delay inicial de 1 segundo, aumentando exponencialmente
- Máximo delay de 30 segundos

### 5. 📱 **PWA Mejorado**
- `manifest.json` actualizado con shortcuts y screenshots
- `service-worker.js` mejorado con caché v2
- Indicador de estado de conexión en tiempo real

---

## 🚀 Cómo Usar

### Notificaciones Automáticas
Las notificaciones se activan automáticamente cuando:
- ✅ Llega un nuevo pedido
- ✅ Se marca un pedido como listo
- ✅ Hay un error

### Vibración Personalizada
```javascript
notificationManager.triggerVibration([200, 100, 200]);
```

### Sonido Directo
```javascript
notificationManager.playNotificationSound();
```

---

## 📱 Compatibilidad

| Feature | Navegadores |
|---------|----------|
| **Web Push API** | Chrome, Firefox, Edge, Safari (limitado) |
| **Vibration API** | La mayoría de navegadores móviles |
| **Web Audio API** | Todos los navegadores modernos |
| **Service Worker** | Chrome, Firefox, Edge, Safari 11.1+ |

---

**Versión:** 2.0  
**Última actualización:** 2026-07-09
