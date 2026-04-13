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
 * Central API fetch: logs every request; throws on non-OK responses.
 *
 * @param {string} url
 * @param {RequestInit & { parseJson?: boolean }} [options]
 * @returns {Promise<unknown>}
 */
export async function apiFetch(url, options = {}) {
  const { parseJson = true, ...init } = options;
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
    throw err;
  }

  const ms = Date.now() - started;
  console.log('[API]', method, url, res.status, `${ms}ms`);

  if (!parseJson) {
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      const j = await parseJsonSafe(res);
      if (j && typeof j === 'object' && j.error) msg = String(j.error);
      if (j && typeof j === 'object' && Array.isArray(j.missingFields) && j.missingFields.length > 0) {
        const fields = j.missingFields.join(', ');
        if (!msg.includes(fields)) msg = `${msg} (fields: ${fields})`;
      }
      throw new Error(msg);
    }
    return res;
  }

  const body = await parseJsonSafe(res);

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (body && typeof body === 'object' && body.error) msg = String(body.error);
    if (
      body &&
      typeof body === 'object' &&
      Array.isArray(body.missingFields) &&
      body.missingFields.length > 0
    ) {
      const fields = body.missingFields.join(', ');
      if (!msg.includes(fields)) {
        msg = `${msg} (fields: ${fields})`;
      }
    }
    throw new Error(msg);
  }

  return body;
}
