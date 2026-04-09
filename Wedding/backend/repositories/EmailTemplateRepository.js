// EmailTemplateRepository.js — PostgreSQL via IDb-compatible adapter

/** @typedef {import('../src/db/IDb.js').IDb} IDb */

class EmailTemplateRepository {
  /** @param {IDb} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {object} template
   * @returns {Promise<void>}
   */
  async create(template) {
    await this.db.query(
      `INSERT INTO email_templates (id, name, subject, "text", html) VALUES ($1, $2, $3, $4, $5)`,
      [template.id, template.name, template.subject, template.text, template.html]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<object | null>}
   */
  async getById(id) {
    const r = await this.db.query('SELECT * FROM email_templates WHERE id = $1', [id]);
    return r.rows[0] ?? null;
  }

  /**
   * @returns {Promise<object[]>}
   */
  async getAll() {
    const r = await this.db.query('SELECT * FROM email_templates');
    return r.rows;
  }

  /**
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<import('pg').QueryResult | null>}
   */
  async update(id, updates) {
    const template = await this.getById(id);
    if (!template) return null;
    return this.db.query(
      `UPDATE email_templates SET name = $1, subject = $2, "text" = $3, html = $4 WHERE id = $5`,
      [
        updates.name ?? template.name,
        updates.subject ?? template.subject,
        updates.text ?? template.text,
        updates.html ?? template.html,
        id,
      ]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<import('pg').QueryResult>}
   */
  async delete(id) {
    return this.db.query('DELETE FROM email_templates WHERE id = $1', [id]);
  }
}

export default EmailTemplateRepository;
