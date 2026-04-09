// ThemeRepository.js — PostgreSQL via IDb-compatible adapter

/** @typedef {import('../src/db/IDb.js').IDb} IDb */

class ThemeRepository {
  /** @param {IDb} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {object} theme
   * @returns {Promise<void>}
   */
  async create(theme) {
    await this.db.query(
      `INSERT INTO themes (id, "primary", "secondary", accent, "fontSize", "isDarkMode")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        theme.id,
        theme.primary,
        theme.secondary,
        theme.accent,
        theme.fontSize,
        theme.isDarkMode === true,
      ]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<object | null>}
   */
  async getById(id) {
    const r = await this.db.query('SELECT * FROM themes WHERE id = $1', [id]);
    return r.rows[0] ?? null;
  }

  /**
   * @returns {Promise<object[]>}
   */
  async getAll() {
    const r = await this.db.query('SELECT * FROM themes');
    return r.rows;
  }

  /**
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<import('pg').QueryResult | null>}
   */
  async update(id, updates) {
    const theme = await this.getById(id);
    if (!theme) return null;
    return this.db.query(
      `UPDATE themes SET "primary" = $1, "secondary" = $2, accent = $3, "fontSize" = $4, "isDarkMode" = $5 WHERE id = $6`,
      [
        updates.primary ?? theme.primary,
        updates.secondary ?? theme.secondary,
        updates.accent ?? theme.accent,
        updates.fontSize ?? theme.fontSize,
        updates.isDarkMode !== undefined ? updates.isDarkMode === true : theme.isDarkMode === true,
        id,
      ]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<import('pg').QueryResult>}
   */
  async delete(id) {
    return this.db.query('DELETE FROM themes WHERE id = $1', [id]);
  }
}

export default ThemeRepository;
