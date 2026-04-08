# Deployment folders

These folders hold production-oriented copies of the frontend and backend for upload to hosting (for example cPanel).

## Backend (`deployment/backend/`)

- **SQLite**: The app uses Node.js built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) (`DatabaseSync`). The `better-sqlite3` and `sqlite3` npm packages are not used.
- **Node.js**: Use **22.5 or newer** on the server so `node:sqlite` is available and stable.
- Install dependencies with `npm install` in the backend directory, configure `.env`, then start via your process manager or cPanel Node selector (see [CPANEL_DEPLOYMENT.md](../CPANEL_DEPLOYMENT.md)).

## Frontend (`deployment/frontend/`)

Static or framework build output for the public site; see the root [README.md](../README.md) for URLs and environment variables.

## Related documentation

- [CPANEL_DEPLOYMENT.md](../CPANEL_DEPLOYMENT.md) – step-by-step cPanel deployment
- [DEPLOYMENT.md](../DEPLOYMENT.md) – environment and file layout overview
