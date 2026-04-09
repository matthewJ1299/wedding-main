# Deployment backend bundle

This folder mirrors `Wedding/backend` for FTP/cPanel-style drops and production packaging.

## Requirements

- **Node.js 22.5+**
- **PostgreSQL** and a valid `DATABASE_URL` for the app

## Database

Migrations live in `migrations/` and should be applied with `npm run migrate` (or your host’s equivalent) before serving traffic. Docker images run migrations on container start via `docker-entrypoint.sh` in `Wedding/backend`.
