/**
 * PostgreSQL implementation of {@link IDb}.
 */
export class PostgresDb {
  /** @param {import('pg').Pool} pool */
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * @param {string} text
   * @param {unknown[]} [params]
   * @returns {Promise<import('pg').QueryResult>}
   */
  query(text, params = []) {
    return this.pool.query(text, params);
  }
}
