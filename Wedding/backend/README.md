# Wedding backend (Next.js API)

## Requirements

- **Node.js 22.5+**
- **PostgreSQL** reachable via `DATABASE_URL` (e.g. `postgres://user:pass@host:5432/dbname`)
- `npm ci` / `npm install`

## Database

- Schema is applied by SQL files in `migrations/` using `npm run migrate` (also runs automatically from `docker-entrypoint.sh` in Docker).
- Repositories in `repositories/` use a small `PostgresDb` adapter (`src/db/`) over the `pg` package.

## Scripts

- `npm run dev` — local Next dev server
- `npm run build` — production build (does not require a live DB connection)
- `npm run start:production` — run `server.js` after build
- `npm run migrate` — apply pending migrations
- `npm run backup:db` — `pg_dump`-based backups (requires `postgresql-client` / `pg_dump` on `PATH`)

## Environment

Set `DATABASE_URL`, `UPLOAD_DIR`, `FRONTEND_URL`, `ORIGIN_URL`, and SMTP variables as documented in the repository root `README.md`.

## API notes

### `POST /api/send-email`

- **Required:** `to`, `subject`, and a non-empty **body**: either `text` or `html` (both may be sent).
- **400 responses** include `error` (human-readable) and `missingFields` (machine-readable names, e.g. `["to"]`, `["text","html"]` when both body fields are empty).
- If `html` is set and `text` is empty, the server derives a plain-text part from HTML for the MIME message.
