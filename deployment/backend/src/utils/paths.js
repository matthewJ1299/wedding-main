import path from 'path';

/**
 * PostgreSQL connection URL (required).
 * Example: postgres://user:pass@host:5432/dbname
 */
export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !String(url).trim()) {
    throw new Error('DATABASE_URL is required (PostgreSQL connection string)');
  }
  return String(url).trim();
}

/**
 * Directory for guest photo uploads (Docker-friendly via UPLOAD_DIR).
 */
export function getUploadsDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
}
