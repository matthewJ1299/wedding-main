import pg from 'pg';
import { getDatabaseUrl } from '../utils/paths.js';
import { PostgresDb } from './PostgresDb.js';

/** @type {PostgresDb | null} */
let db = null;

/** @returns {PostgresDb} */
export function getDb() {
  if (!db) {
    const pool = new pg.Pool({
      connectionString: getDatabaseUrl(),
      max: 10,
    });
    db = new PostgresDb(pool);
  }
  return db;
}
