import { DatabaseSync } from 'node:sqlite';

/** One connection per db path per process (avoids lock errors when many API routes load). */
const connections = new Map();

/**
 * Opens a SQLite file using Node's built-in SQLite (node:sqlite).
 * No third-party native addons; requires Node.js 22.5+.
 */
export function openDatabaseSync(dbPath) {
  if (connections.has(dbPath)) {
    return connections.get(dbPath);
  }
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 5000');
  connections.set(dbPath, db);
  return db;
}
