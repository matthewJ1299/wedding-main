import path from 'path';

/**
 * Resolved SQLite database file path (Docker-friendly via DATABASE_PATH or DB_PATH).
 */
export function getDatabasePath() {
  return (
    process.env.DATABASE_PATH ||
    process.env.DB_PATH ||
    path.join(process.cwd(), 'data.sqlite')
  );
}

/**
 * Directory for guest photo uploads (Docker-friendly via UPLOAD_DIR).
 */
export function getUploadsDir() {
  return (
    process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')
  );
}
