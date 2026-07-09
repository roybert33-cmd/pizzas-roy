/**
 * SISTEMA DE NOTIFICACIONES AVANZADO
 * Notificaciones en segundo plano + Vibración + Sonido
 */

class NotificationManager {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = true;
    this.vibrationEnabled = true;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.baseDelay = 1000; // 1 segundo
    this.init();
  }

  init() {
    console.log('🔔 NotificationManager inicializado');
    this.requestPermissions();
    this.initAudioContext();
    this.setupServiceWorker();
  }

  /**
   * SOLICITAR PERMISOS DE NOTIFICACIÓN
   */
  async requestPermissions() {
    try {
      // Solicitar permiso de notificaciones
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        console.log('📱 Permiso de notificación:', permission);
      }

      // Solicitar permiso de vibración (siempre disponible)
      if (navigator.vibrate) {
        console.log('📳 Vibración disponible');
      }

      // Solicitar permiso para Service Worker Push
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription && Notification.permission === 'granted') {
          console.log('🔄 Intentando suscribirse a push...');
          // Aquí va tu lógica de suscripción
        }
      }
    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
    }
  }

  /**
   * INICIALIZAR AUDIO CONTEXT
   */
  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      console.log('🎵 AudioContext inicializado');
    } catch (error) {
      console.warn('⚠️ AudioContext no disponible:', error);
      this.soundEnabled = false;
    }
  }

  /**
   * REPRODUCIR SONIDO DE NOTIFICACIÓN
   */
  playNotificationSound() {
    if (!this.soundEnabled) return;

    try {
      // Intentar reproducir archivo de audio
      const audio = new Audio('./notification-sound.mp3');
      audio.volume = 1.0;
      audio.play().catch(err => {
        console.warn('⚠️ Error reproduciendo audio:', err);
        // Fallback: generar sonido con Web Audio API
        this.playToneNotification();
      });
    } catch (error) {
      console.error('❌ Error con audio:', error);
      this.playToneNotification();
    }
  }

  /**
   * GENERAR SONIDO CON WEB AUDIO API (FALLBACK)
   */
  playToneNotification() {
    if (!this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // Crear oscilador
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Parámetros de sonido
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);

      // Segundo tono
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        const now2 = ctx.currentTime;
        osc2.frequency.setValueAtTime(1000, now2);
        osc2.frequency.exponentialRampToValueAtTime(800, now2 + 0.1);

        gain2.gain.setValueAtTime(0.3, now2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.1);

        osc2.start(now2);
        osc2.stop(now2 + 0.1);
      }, 150);

      console.log('🎵 Sonido de notificación generado');
    } catch (error) {
      console.error('❌ Error generando sonido:', error);
    }
  }

  /**
   * VIBRACIÓN PERSONALIZADA
   */
  triggerVibration(pattern = [300, 100, 300]) {
    if (!this.vibrationEnabled || !navigator.vibrate) {
      console.warn('⚠️ Vibración no disponible');
      return;
    }

    try {
      navigator.vibrate(pattern);
      console.log('📳 Vibración activada:', pattern);
    } catch (error) {
      console.error('❌ Error con vibración:', error);
    }
  }

  /**
   * MOSTRAR NOTIFICACIÓN COMPLETA
   */
  async showNotification(title, options = {}) {
    const defaultOptions = {
      icon: 'icono-pizza.png',
      badge: 'icono-pizza.png',
      tag: 'pizza-notification',
      requireInteraction: true,
      ...options
    };

    try {
      // Vibración
      this.triggerVibration([200, 100, 200, 100, 300]);

      // Sonido
      this.playNotificationSound();

      // Notificación Web
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, defaultOptions);
        console.log('✅ Notificación mostrada:', title);
      }

      // Notificación en Service Worker (si está disponible)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
          registration.active.postMessage({
            type: 'SHOW_NOTIFICATION',
            title,
            options: defaultOptions
          });
        }
      }
    } catch (error) {
      console.error('❌ Error mostrando notificación:', error);
    }
  }

  /**
   * NOTIFICACIÓN DE ÉXITO
   */
  notifySuccess(message = 'Operación exitosa') {
    this.showNotification('✅ ' + message, {
      body: 'La operación se completó correctamente',
      tag: 'success-notification'
    });
  }

  /**
   * NOTIFICACIÓN DE ERROR
   */
  notifyError(message = 'Error') {
    this.triggerVibration([500, 100, 500]); // Vibración diferente para errores
    this.showNotification('❌ ' + message, {
      body: 'Hubo un problema',
      tag: 'error-notification'
    });
  }

  /**
   * NOTIFICACIÓN DE PEDIDO LISTO
   */
  notifyOrderReady(orderNumber) {
    this.triggerVibration([200, 50, 200, 50, 200, 50, 400]); // Patrón especial
    this.showNotification('🍕 Pedido Listo', {
      body: `El pedido #${orderNumber} está listo para entregar`,
      tag: 'order-ready',
      requireInteraction: true,
      actions: [
        { action: 'open', title: '👀 Ver' },
        { action: 'dismiss', title: '✕ Cerrar' }
      ]
    });
  }

  /**
   * SETUP SERVICE WORKER
   */
  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./service-worker.js');
        console.log('✅ Service Worker registrado:', registration);

        // Manejar actualización del Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📦 Nueva versión disponible');
              this.showNotification('Actualización disponible', {
                body: 'Nueva versión de la aplicación disponible',
                tag: 'update-notification'
              });
            }
          });
        });
      } catch (error) {
        console.error('❌ Error registrando Service Worker:', error);
      }
    }
  }

  /**
   * RECONEXIÓN AUTOMÁTICA CON BACKOFF EXPONENCIAL
   */
  reconnectWithBackoff(reconnectFunction) {
    const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts);
    const maxDelay = 30000; // 30 segundos máximo
    const actualDelay = Math.min(delay, maxDelay);

    console.log(`🔄 Reconectando en ${actualDelay}ms (intento ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        try {
          reconnectFunction();
          this.reconnectAttempts = 0; // Reset en caso de éxito
          console.log('✅ Reconexión exitosa');
        } catch (error) {
          console.error('❌ Error en reconexión:', error);
          this.reconnectAttempts++;
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectWithBackoff(reconnectFunction);
          } else {
            console.error('❌ Máximo de intentos de reconexión alcanzado');
            this.notifyError('No se pudo conectar al servidor');
          }
        }
      }
    }, actualDelay);
  }

  /**
   * ESTADO DE CONEXIÓN
   */
  updateConnectionStatus(isConnected) {
    if (isConnected) {
      console.log('✅ Conectado');
      this.reconnectAttempts = 0;
    } else {
      console.log('⚠️ Desconectado');
    }
  }
}

// Crear instancia global
const notificationManager = new NotificationManager();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationManager;
}
