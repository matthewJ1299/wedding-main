import { notifyToast } from '../notifications/notificationBus';

/**
 * @param {string} url
 * @returns {string}
 */
function pathnameOnly(url) {
  try {
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost';
    return new URL(url, base).pathname;
  } catch {
    return url;
  }
}

/**
 * @param {string} method
 * @param {string} url
 * @returns {string}
 */
function defaultSuccessMessage(method, url) {
  const path = pathnameOnly(url);
  return `${method} ${path} — OK`;
}

/**
 * @param {Response} res
 * @returns {Promise<unknown>}
 */
async function parseJsonSafe(res) {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return null;
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Central API fetch: logs every request and shows success/error toasts (unless disabled).
 *
 * @param {string} url
 * @param {RequestInit & {
 *   successMessage?: string,
 *   skipToast?: boolean,
 *   parseJson?: boolean,
 * }} [options]
 * @returns {Promise<unknown>}
 */
export async function apiFetch(url, options = {}) {
  const { successMessage, skipToast = false, parseJson = true, ...init } = options;
  const method = (init.method || 'GET').toUpperCase();
  const started = Date.now();
  console.log('[API]', method, url, 'started');

  /** @type {Response} */
  let res;
  try {
    res = await fetch(url, init);
  } catch (err) {
    const ms = Date.now() - started;
    console.error('[API]', method, url, 'network error after', ms, 'ms', err);
    if (!skipToast) {
      notifyToast({ type: 'error', message: err.message || 'Network error' });
    }
    throw err;
  }

  const ms = Date.now() - started;
  console.log('[API]', method, url, res.status, `${ms}ms`);

  if (!parseJson) {
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      const j = await parseJsonSafe(res);
      if (j && typeof j === 'object' && j.error) msg = String(j.error);
      if (!skipToast) notifyToast({ type: 'error', message: msg });
      throw new Error(msg);
    }
    if (!skipToast) {
      notifyToast({
        type: 'success',
        message: successMessage || defaultSuccessMessage(method, url),
      });
    }
    return res;
  }

  const body = await parseJsonSafe(res);

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (body && typeof body === 'object' && body.error) msg = String(body.error);
    if (!skipToast) notifyToast({ type: 'error', message: msg });
    throw new Error(msg);
  }

  if (!skipToast) {
    notifyToast({
      type: 'success',
      message: successMessage || defaultSuccessMessage(method, url),
    });
  }

  return body;
}
