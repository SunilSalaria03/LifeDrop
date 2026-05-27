'use client';

import { useEffect } from 'react';

const SERVICE_WORKER_PATH = '/service-worker.js';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!('serviceWorker' in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const existingRegistration = registrations.find(registration => {
          const scriptUrl =
            registration.active?.scriptURL ??
            registration.waiting?.scriptURL ??
            registration.installing?.scriptURL;

          return scriptUrl?.endsWith(SERVICE_WORKER_PATH);
        });

        if (existingRegistration) {
          return;
        }

        await navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: '/' });
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    void registerServiceWorker();
  }, []);

  return null;
}
