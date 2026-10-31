import type { Analytics } from 'firebase/analytics';

let initialization: Promise<Analytics | null> | undefined;

/** Load analytics separately from auth, and only when the browser can use it. */
export function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);

  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.NEXT_PUBLIC_MEASUREMENT_ID;
  const debug = process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG === 'true';
  const local = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(window.location.hostname);
  if (!/^G-[A-Z0-9]+$/i.test(measurementId || '') || (!debug && (process.env.NODE_ENV !== 'production' || local))) {
    return Promise.resolve(null);
  }

  if (!initialization) {
    initialization = (async () => {
      const { isSupported, getAnalytics, setDefaultEventParameters } = await import('firebase/analytics');
      if (!(await isSupported())) return null;
      const { firebaseApp } = await import('./config');
      const analytics = getAnalytics(firebaseApp);
      if (debug) setDefaultEventParameters({ debug_mode: true });
      return analytics;
    })().catch(() => {
      // Unsupported storage, browser extensions, or unavailable SDKs must not break the app.
      return null;
    });
  }
  return initialization;
}
