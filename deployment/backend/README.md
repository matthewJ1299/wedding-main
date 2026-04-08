# Wedding backend (Next.js + Express)

## Requirements

- **Node.js 22.5+** (built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html); no native `better-sqlite3` package)

## Local build, then FTP (typical cPanel flow)

1. On your machine, from `Wedding/backend`:
   - `npm install`
   - `npm run build` (produces **`.next`** — required)
2. Upload the app folder to the server **including** `.next`, `server.js`, `cors-origin.cjs`, `package.json`, `package-lock.json`, `next.config.mjs`, `public/`, `repositories/`, `src/`, etc.
3. **Do not** omit `.next`. If you use the repo’s `build-production.bat` / `build-production.sh`, the packaged `deployment/backend/` already contains `.next` and omits only `node_modules`.
4. On the server: `npm ci --omit=dev` (or `npm install --omit=dev`).
5. Configure `.env` (see `env.production.txt` in `Wedding/backend`).
6. Start with `npm run start:cpanel` or your process manager (see [CPANEL_DEPLOYMENT.md](../../CPANEL_DEPLOYMENT.md)).

## Why `npm run build` matters

`node server.js` loads the compiled Next app from **`.next`**. Uploading only source without a local (or server-side) `npm run build` will fail at runtime.
