/** @typedef {{ message: string, type?: 'success' | 'error' | 'warning' | 'info' }} ToastPayload */

const listeners = new Set();

/**
 * @param {(payload: ToastPayload) => void} listener
 * @returns {() => void}
 */
export function subscribeToast(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * @param {ToastPayload} payload
 */
export function notifyToast(payload) {
  listeners.forEach((fn) => {
    try {
      fn(payload);
    } catch (e) {
      console.error('Toast listener error:', e);
    }
  });
}
