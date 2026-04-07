# Changelog

## 2026-04-07

- **Production domains**: Default and documented deployment URLs now use `https://matthewandsydney.co.za` (frontend) and `https://matthewandsydneyapi.co.za` (backend API). Updated CORS defaults (`FRONTEND_URL` / `ORIGIN_URL`), Apache `Access-Control-Allow-Origin` and Content-Security-Policy `connect-src`, `build:cpanel` and production build scripts, env templates, and deployment docs. See [DEPLOYMENT.md](DEPLOYMENT.md) and [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md).
