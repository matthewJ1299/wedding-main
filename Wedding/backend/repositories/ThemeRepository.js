// ThemeRepository.js
// Repository pattern for Theme entity using Node's built-in node:sqlite

import { openDatabaseSync } from '../src/utils/openDatabaseSync.js';

class ThemeRepository {
  constructor(dbPath) {
    this.db = openDatabaseSync(dbPath);
    this._initTable();
  }

  _initTable() {
    this.db.prepare(`CREATE TABLE IF NOT EXISTS themes (
      id TEXT PRIMARY KEY,
      primary TEXT,
      secondary TEXT,
      accent TEXT,
      fontSize INTEGER,
      isDarkMode INTEGER
    )`).run();
  }

  create(theme) {
    const stmt = this.db.prepare(`INSERT INTO themes (id, primary, secondary, accent, fontSize, isDarkMode) VALUES (?, ?, ?, ?, ?, ?)`);
    return stmt.run(theme.id, theme.primary, theme.secondary, theme.accent, theme.fontSize, theme.isDarkMode ? 1 : 0);
  }

  getById(id) {
    return this.db.prepare(`SELECT * FROM themes WHERE id = ?`).get(id);
  }

  getAll() {
    return this.db.prepare(`SELECT * FROM themes`).all();
  }

  update(id, updates) {
    const theme = this.getById(id);
    if (!theme) return null;
    const stmt = this.db.prepare(`UPDATE themes SET primary = ?, secondary = ?, accent = ?, fontSize = ?, isDarkMode = ? WHERE id = ?`);
    return stmt.run(
      updates.primary ?? theme.primary,
      updates.secondary ?? theme.secondary,
      updates.accent ?? theme.accent,
      updates.fontSize ?? theme.fontSize,
      updates.isDarkMode !== undefined ? (updates.isDarkMode ? 1 : 0) : theme.isDarkMode,
      id
    );
  }

  delete(id) {
    return this.db.prepare(`DELETE FROM themes WHERE id = ?`).run(id);
  }
}

export default ThemeRepository;
