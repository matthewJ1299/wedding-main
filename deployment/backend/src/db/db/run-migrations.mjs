import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { getDatabaseUrl } from '../utils/paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', '..', 'migrations');

async function ensureMetaTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function appliedFiles(client) {
  const r = await client.query('SELECT filename FROM schema_migrations ORDER BY filename');
  return new Set(r.rows.map((row) => row.filename));
}

async function run() {
  const url = getDatabaseUrl();
  const client = new pg.Client({ connectionString: url });
  await client.connect();

  try {
    await ensureMetaTable(client);
    const done = await appliedFiles(client);

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (done.has(file)) continue;
      const full = path.join(migrationsDir, file);
      const sql = fs.readFileSync(full, 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`Migration applied: ${file}`);
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      }
    }
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error('Migrations failed:', err);
  process.exit(1);
});
