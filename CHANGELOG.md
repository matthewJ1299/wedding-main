# Changelog

## 2026-04-13

- **RSVP email**: Thank-you message after RSVP uses DB templates `tpl-canva-rsvp-yes` / `tpl-canva-rsvp-no` (see `RSVP_THANK_YOU_TEMPLATE_IDS` in frontend constants). Shared guest merge fields live in `getGuestEmailMergeFields()` (`emailTemplateDefaults.js`).

- **Frontend**: Removed global API toasts (`ToastHost`, `notificationBus`) and all MUI `Snackbar` toast-style notifications. `apiFetch` only logs to the console; RSVP still shows inline success/error alerts; admin email template actions log errors to the console on failure.

- **RSVP guest notes**: Optional free-text dietary/allergies (replacing meal dropdown; still stored as `mealSelection`), optional message to the couple (`messageToCouple`), backend migration `002_invitee_message_to_couple.sql`, repository/API updates, and CSV export columns on admin Invitees + Summary exports.

## 2026-04-09 (database + admin API UX)

- **PostgreSQL**: Replaced SQLite (`node:sqlite` / `data.sqlite`) with PostgreSQL via `pg`, `DATABASE_URL`, and versioned SQL migrations (`Wedding/backend/migrations`, applied by `src/db/run-migrations.mjs` from Docker entrypoint). Docker Compose now includes a `postgres` service and a `postgres_data` volume; backend depends on DB health checks.
- **Backups**: `npm run backup:db` / `src/utils/dbBackup.js` uses `pg_dump` / `psql` (PostgreSQL client tools). The backend Docker image no longer installs `postgresql-client` by default (to avoid hosted builder `apt-get` flakiness); run backups from a separate ops container/job or use platform DB backup/snapshots.
- **Coolify build stability**: Backend and frontend Docker build stages now use `npm ci --include=dev` so builds succeed even when `NODE_ENV=production` is injected as a build argument (which otherwise omits devDependencies required for `npm run build`).
- **Seed build fix**: Restored `DUMMY_INVITEES` export in `src/seed/invitees.js` (and deployment mirror) to fix backend `next build` failure in `/api/seed` route (`Export DUMMY_INVITEES doesn't exist in target module`).
- **Admin API logging**: Frontend HTTP calls go through `src/services/apiFetch.js` (console request logging). (Toasts were added then later removed; see 2026-04-13 changelog entry.)

## 2026-04-09

- **RSVP modal**: RSVP now opens in a modal (from the nav RSVP button and the floating RSVP button) instead of rendering the RSVP card below the hero image. The direct `/rsvp/:inviteCode` link still works and auto-opens the modal.
- **Partner = plus-one name**: Standardized naming so the “plus one” and “partner” are treated as the same person (stored in `partner`). Plus-one contact details are stored as `plusOneEmail` / `plusOnePhone`.
- **Invitees table linked pairs**: Guests with a partner/plus-one now render as linked two-row couple blocks in the Invitees table (instead of incorrectly showing as “Single” when the second person is not a standalone invitee record).
- **Couple RSVP sync + simplified table columns**: Removed plus-one email/phone columns from the Invitees table and aligned couple rows to a shared invite link. RSVP submissions now sync status to both linked partner records so one response updates the couple.
- **Invitee modal plus-one UX**: The partner/plus-one name input in Add Invitee now appears only when “Allow Plus One” is checked, and is cleared automatically when unchecked.
- **Invitees table add modal**: Added an “Add invitee” button on the Admin → Invitees table that opens the existing add-invitee fields inside a modal for quicker entry without switching tabs.
- **Plus-one details (end-to-end)**: Plus one details now support **name + email + phone**. This is captured from Admin “Add invitee” and from the RSVP flow (when a plus one is allowed and not pre-defined as a partner), persisted in the backend, and visible/editable in the Admin invitees table and exports.

- **Admin email groups**: The Admin “Email → Send Email” tab now supports sending to recipient groups (All / Accepted / Declined / Pending) and lets you optionally choose an invitee to preview template personalization before sending.

- **Email variable formatting**: Template placeholders now replace `{{var}}` before `{var}` to avoid leftover braces like `{Matthew}` when using Handlebars-style variables.

- **NavBar RSVP gating**: The navigation bar now only shows the RSVP link when an invitee context/id is present (i.e., when accessed via an invite-specific link).

- **Homepage header/footer RSVP gating**: The homepage `HeaderNavigation` and `FooterNavigation` now also hide RSVP unless an invitee context/id is present.

- **RSVP flow (link-first)**: Guests who open their unique `/rsvp/:inviteCode` link are taken straight to a details summary (guest + partner/plus-one, email, phone) and can RSVP without typing their name to “verify”.

- **Invitee table robustness**: Invitee rows now render empty strings for missing fields to prevent visual/header misalignment when data is incomplete.

## 2026-04-08

- **Landing notice (Coolify)**: Build-time `REACT_APP_SHOW_LANDING_POPUP` (`true` / `false`) and optional `REACT_APP_LANDING_POPUP_MESSAGE` drive a red MUI dialog on load (`LandingNoticeDialog`). Wired through `docker-compose.yml`, `docker-compose.local.yml`, frontend `Dockerfile`, and `.env.production`.

- **CORS / API subdomain (Coolify)**: Helmet’s default `Cross-Origin-Resource-Policy: same-origin` blocked cross-subdomain browser access from `matthewandsydney.co.za` to `api.matthewandsydney.co.za`; `server.js` now sets `{ policy: 'cross-origin' }`. Applied CORS headers for all `/api` requests before Next handles them (so 404/500 still include `Access-Control-Allow-Origin`), `trust proxy`, and `listen(..., '0.0.0.0')` for Docker. Mirrored in `deployment/backend/server.js`.

- **Docker Compose / Coolify**: Default `docker-compose.yml` no longer publishes host ports `8080`/`3001` (uses `expose` only) so Coolify and other hosts do not hit `port is already allocated` when 8080 is taken. Local testing: `docker compose -f docker-compose.yml -f docker-compose.local.yml up --build`. Compose defaults `FRONTEND_URL` / `ORIGIN_URL` / `REACT_APP_*` to `https://matthewandsydney.co.za` and `https://api.matthewandsydney.co.za`; `docker-compose.local.yml` overrides to localhost for laptop builds.

- **SMTP / Docker**: Replaced Gmail-only nodemailer with generic SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, optional `SMTP_FROM`) in `Wedding/backend/src/emailModule.js`; `EMAIL_USER` / `EMAIL_PASS` remain aliases for auth. Added `Wedding/backend/src/utils/paths.js` (`getDatabasePath`, `getUploadsDir`), wired API routes + `dbBackup` + `test-api`, fixed duplicate `environment` key in `/api/health`, added repo-root `docker-compose.yml`, `Wedding/backend/Dockerfile` + `docker-entrypoint.sh`, `Wedding/frontend/Dockerfile` + `nginx.conf`, and `.env.docker.example`.

- **CORS hardening**: Normalized `ORIGIN_URL` / `FRONTEND_URL` origin parsing in `cors-origin.cjs` (handles trailing slash/path safely), and added `Vary: Origin`, `Access-Control-Max-Age`, plus broader preflight request headers in backend CORS responses (`server.js` and `/api/invitees` route in both `Wedding/backend` and `deployment/backend`).

- **cPanel startup-file mode hardening**: Updated `Wedding/backend/server.js` and `deployment/backend/server.js` to default `NODE_ENV` to `production` when unset (common on shared hosts that only ask for a startup file). This prevents accidental Next dev-mode startup (`next-dev` paths, turbopack/thread-pool errors) in production.

- **Next config warning cleanup**: Removed the `env.CUSTOM_KEY` block from `next.config.mjs` in `Wedding/backend` and `deployment/backend` to avoid `Invalid next.config.mjs options` warnings when `CUSTOM_KEY` is not provided.

- **Next.js config on cPanel**: Replaced `next.config.ts` with `next.config.mjs` in `Wedding/backend` (and `deployment/backend`). Many shared hosts run plain Node without loading TypeScript config; Next then throws *Configuring Next.js via 'next.config.ts' is not supported*. **Note:** this app still requires **Node.js 22.5+** at runtime for built-in `node:sqlite`; the log path `nodevenv/.../18` means the selector is on Node 18—you must switch the cPanel Node.js app to **22.x** (or newer offered) after fixing the config file.

- **Backend Apache preflight (CORS)**: Removed the `OPTIONS` `RewriteRule` from `Wedding/backend/.htaccess` (and `deployment/backend/.htaccess`) that answered preflight at Apache with `[R=200,L]` instead of proxying to Node, which caused “preflight does not have HTTP ok status” for POST `/api/invitees`. Removed duplicate `Access-Control-*` headers from Apache so CORS is set only by Express (`cors-origin.cjs` / `server.js`) on proxied responses.

- **Backend FTP / deployment packaging**: `build-production.sh` and `build-production.bat` now run `npm run build` in `Wedding/backend` before copying to `deployment/backend/`, and **no longer delete `.next`** (only `node_modules` is removed from the deployment copy). Previously the packaged backend could not run after FTP because the Next.js build output was missing. Updated [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md) and `deployment/backend/README.md` with the local-build + `npm ci --omit=dev` on server flow.

- **Backend CORS**: Added `cors-origin.cjs` (shared allow-list: `ORIGIN_URL` / `FRONTEND_URL`, production default, `www.` variant, localhost for dev). Express `server.js` now applies CORS on `/api` **before** the rate limiter (so 429 responses include CORS), handles OPTIONS with 204, adds CORS on `handle()` rejection and on the rate-limit handler. `/api/invitees` uses the same origin resolution and supports `DATABASE_PATH` or `DB_PATH` for the SQLite file. Mirrored under `deployment/backend/`.

- **Frontend production env**: Added `Wedding/frontend/.env.production` with `REACT_APP_API_URL` and `REACT_APP_SITE_URL` so a plain `npm run build` embeds the live API and site (avoids the localhost fallback blocked by CSP on cPanel).

- **cPanel / SPA routing**: Replaced `Wedding/frontend/public/.htaccess` with the full SPA rewrite rules (fallback to `index.html` for paths like `/admin`). CRA only copies `public/` into `build/`, so the previous `public/.htaccess` had no rewrite and production could 404 on deep links. Synced `Wedding/frontend/.htaccess` and `deployment/frontend/.htaccess`. Documented in [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md) that the build output includes `.htaccess` automatically.

## 2026-04-07

- **SQLite driver**: Removed `better-sqlite3` and all `sqlite3` npm fallback references. Data access now uses Node.js built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) via `src/utils/openDatabaseSync.js` (`DatabaseSync`, one shared connection per db path per process, plus `busy_timeout`). **Node.js 22.5+** is required for the backend; Node may log an experimental SQLite warning until the API is fully stable. Updated `Wedding/backend`, `deployment/backend`, `server.js`, docs (`README`, `CPANEL_DEPLOYMENT`, `DEPLOYMENT`, `deployment/README`, `build-production.bat`), and `package.json` `engines`.
- **Build**: Added devDependency `critters` so `experimental.optimizeCss` in the Next config can complete production builds (Next 15 expects this package when CSS optimization runs).

- **Backend API imports**: Corrected relative paths so Turbopack can resolve modules from `src/app/api/`: health route imports `../../../utils/logger.js`; dynamic route `api/email-templates/[id]` imports `../../../../../repositories/EmailTemplateRepository.js`. Pinned `next` at `15.5.3` in `dependencies` where applicable.

- **Production domains**: Default and documented deployment URLs now use `https://matthewandsydney.co.za` (frontend) and `https://api.matthewandsydney.co.za` (backend API). Updated CORS defaults (`FRONTEND_URL` / `ORIGIN_URL`), Apache `Access-Control-Allow-Origin` and Content-Security-Policy `connect-src`, `build:cpanel` and production build scripts, env templates, and deployment docs. See [DEPLOYMENT.md](DEPLOYMENT.md) and [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md).
