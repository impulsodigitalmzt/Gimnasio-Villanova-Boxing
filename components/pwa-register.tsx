'use client';

import { useEffect } from 'react';

/**
 * Registra el service worker solo en producción.
 * En desarrollo lo desregistra para evitar chunks de `/_next` cacheados
 * (causa típica: "Lazy element type must resolve to undefined").
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const run = async () => {
      try {
        if (process.env.NODE_ENV !== 'production') {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((reg) => reg.unregister()));
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
          }
          return;
        }

        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      } catch {
        // Silencioso en demos / entornos sin SW
      }
    };

    if (document.readyState === 'complete') {
      void run();
    } else {
      window.addEventListener('load', () => void run(), { once: true });
    }
  }, []);

  return null;
}
