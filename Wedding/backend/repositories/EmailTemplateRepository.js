// EmailTemplateRepository.js
// Repository pattern for EmailTemplate entity using Node's built-in node:sqlite

import { openDatabaseSync } from '../src/utils/openDatabaseSync.js';

class EmailTemplateRepository {
  constructor(dbPath) {
    this.db = openDatabaseSync(dbPath);
    this._initTable();
  }

  _initTable() {
    this.db.prepare(`CREATE TABLE IF NOT EXISTS email_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT,
      text TEXT,
      html TEXT
    )`).run();
  }

  create(template) {
    const stmt = this.db.prepare(`INSERT INTO email_templates (id, name, subject, text, html) VALUES (?, ?, ?, ?, ?)`);
    return stmt.run(template.id, template.name, template.subject, template.text, template.html);
  }

  getById(id) {
    return this.db.prepare(`SELECT * FROM email_templates WHERE id = ?`).get(id);
  }

  getAll() {
    return this.db.prepare(`SELECT * FROM email_templates`).all();
  }

  update(id, updates) {
    const template = this.getById(id);
    if (!template) return null;
    const stmt = this.db.prepare(`UPDATE email_templates SET name = ?, subject = ?, text = ?, html = ? WHERE id = ?`);
    return stmt.run(
      updates.name ?? template.name,
      updates.subject ?? template.subject,
      updates.text ?? template.text,
      updates.html ?? template.html,
      id
    );
  }

  delete(id) {
    return this.db.prepare(`DELETE FROM email_templates WHERE id = ?`).run(id);
  }
}

export default EmailTemplateRepository;
