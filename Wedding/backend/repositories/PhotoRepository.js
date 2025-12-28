// PhotoRepository.js
// Repository pattern for Photo entity using better-sqlite3
// Follows SOLID, DRY, YAGNI principles

import Database from 'better-sqlite3';

class PhotoRepository {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this._initTable();
  }

  _initTable() {
    this.db.prepare(`CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      mimeType TEXT NOT NULL,
      size INTEGER NOT NULL,
      uploaderName TEXT,
      uploaderEmail TEXT,
      approved INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`).run();
  }

  create(photo) {
    const stmt = this.db.prepare(`INSERT INTO photos (id, filename, originalName, mimeType, size, uploaderName, uploaderEmail, approved, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    return stmt.run(
      photo.id,
      photo.filename,
      photo.originalName,
      photo.mimeType,
      photo.size,
      photo.uploaderName ?? null,
      photo.uploaderEmail ?? null,
      photo.approved ? 1 : 0,
      photo.createdAt,
      photo.updatedAt
    );
  }

  getById(id) {
    return this.db.prepare(`SELECT * FROM photos WHERE id = ?`).get(id);
  }

  getAll() {
    return this.db.prepare(`SELECT * FROM photos ORDER BY createdAt DESC`).all();
  }

  getApproved() {
    return this.db.prepare(`SELECT * FROM photos WHERE approved = 1 ORDER BY createdAt DESC`).all();
  }

  getPending() {
    return this.db.prepare(`SELECT * FROM photos WHERE approved = 0 ORDER BY createdAt DESC`).all();
  }

  update(id, updates) {
    const photo = this.getById(id);
    if (!photo) return null;
    
    const stmt = this.db.prepare(`UPDATE photos SET filename = ?, originalName = ?, mimeType = ?, size = ?, uploaderName = ?, uploaderEmail = ?, approved = ?, updatedAt = ? WHERE id = ?`);
    return stmt.run(
      updates.filename ?? photo.filename,
      updates.originalName ?? photo.originalName,
      updates.mimeType ?? photo.mimeType,
      updates.size !== undefined ? updates.size : photo.size,
      updates.uploaderName !== undefined ? updates.uploaderName : photo.uploaderName,
      updates.uploaderEmail !== undefined ? updates.uploaderEmail : photo.uploaderEmail,
      updates.approved !== undefined ? (updates.approved ? 1 : 0) : photo.approved,
      updates.updatedAt ?? photo.updatedAt,
      id
    );
  }

  delete(id) {
    return this.db.prepare(`DELETE FROM photos WHERE id = ?`).run(id);
  }

  approve(id) {
    const photo = this.getById(id);
    if (!photo) return null;
    
    const stmt = this.db.prepare(`UPDATE photos SET approved = 1, updatedAt = ? WHERE id = ?`);
    return stmt.run(new Date().toISOString(), id);
  }

  reject(id) {
    const photo = this.getById(id);
    if (!photo) return null;
    
    const stmt = this.db.prepare(`UPDATE photos SET approved = 0, updatedAt = ? WHERE id = ?`);
    return stmt.run(new Date().toISOString(), id);
  }

  getStats() {
    const total = this.db.prepare(`SELECT COUNT(*) as count FROM photos`).get();
    const approved = this.db.prepare(`SELECT COUNT(*) as count FROM photos WHERE approved = 1`).get();
    const pending = this.db.prepare(`SELECT COUNT(*) as count FROM photos WHERE approved = 0`).get();
    
    return {
      total: total.count,
      approved: approved.count,
      pending: pending.count
    };
  }
}

export default PhotoRepository;

