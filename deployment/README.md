# Deployment folders

These folders hold production-oriented copies of the frontend and backend for upload to hosting (for example cPanel).

## Backend (`deployment/backend/`)

- **PostgreSQL**: The API uses the `pg` driver and **`DATABASE_URL`**. Apply SQL migrations (`npm run migrate` in that folder, or run the same scripts as `Wedding/backend`) before handling traffic.
- **Node.js**: Use **22.5 or newer** for the Next.js 15 runtime used in `Wedding/backend`.
- Install dependencies with `npm ci` or `npm install`, set `DATABASE_URL` and other vars in `.env`, then start via your process manager or cPanel Node selector (see [CPANEL_DEPLOYMENT.md](../CPANEL_DEPLOYMENT.md)).

## Frontend (`deployment/frontend/`)

Static or framework build output for the public site; see the root [README.md](../README.md) for URLs and environment variables.

## Related documentation

- [CPANEL_DEPLOYMENT.md](../CPANEL_DEPLOYMENT.md) – step-by-step cPanel deployment
- [DEPLOYMENT.md](../DEPLOYMENT.md) – environment and file layout overview
