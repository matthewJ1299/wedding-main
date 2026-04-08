'use strict';

/**
 * Shared CORS allow-origin resolution for Express (server.js) and Next.js API routes.
 * Keep FRONTEND_URL / ORIGIN_URL in backend .env aligned with the public site (e.g. https://matthewandsydney.co.za).
 */

const DEFAULT_ORIGIN = 'https://matthewandsydney.co.za';

function normalizeOrigin(value, fallback = DEFAULT_ORIGIN) {
  if (!value) return fallback;
  try {
    return new URL(value).origin;
  } catch (_) {
    return String(value).replace(/\/+$/, '');
  }
}

function getAllowedOriginSet() {
  const configured = normalizeOrigin(
    process.env.ORIGIN_URL || process.env.FRONTEND_URL,
    DEFAULT_ORIGIN
  );
  const set = new Set([configured, 'http://localhost:3000']);
  try {
    const u = new URL(configured);
    set.add(`${u.protocol}//www.${u.hostname}`);
  } catch (_) {
    /* ignore invalid URL */
  }
  return { configured, set };
}

function allowedOriginFromHeaders(originHeader) {
  const { configured, set } = getAllowedOriginSet();
  if (originHeader && set.has(originHeader)) {
    return originHeader;
  }
  return configured;
}

/** Express: req.get('Origin') */
function allowedOriginFromExpress(req) {
  return allowedOriginFromHeaders(req.get('Origin'));
}

/** Next.js Request */
function allowedOriginFromNextRequest(request) {
  const h = request.headers.get('origin');
  return allowedOriginFromHeaders(h || undefined);
}

module.exports = {
  DEFAULT_ORIGIN,
  normalizeOrigin,
  allowedOriginFromHeaders,
  allowedOriginFromExpress,
  allowedOriginFromNextRequest,
};
