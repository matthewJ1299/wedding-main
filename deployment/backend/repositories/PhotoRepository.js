// PhotoRepository.js — PostgreSQL via IDb-compatible adapter

/** @typedef {import('../src/db/IDb.js').IDb} IDb */

class PhotoRepository {
  /** @param {IDb} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {object} photo
   * @returns {Promise<void>}
   */
  async create(photo) {
    await this.db.query(
      `INSERT INTO photos (id, filename, "originalName", "mimeType", size, "uploaderName", "uploaderEmail", approved, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::timestamptz, $10::timestamptz)`,
      [
        photo.id,
        photo.filename,
        photo.originalName,
        photo.mimeType,
        photo.size,
        photo.uploaderName ?? null,
        photo.uploaderEmail ?? null,
        photo.approved === true,
        photo.createdAt,
        photo.updatedAt,
      ]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<object | null>}
   */
  async getById(id) {
    const r = await this.db.query('SELECT * FROM photos WHERE id = $1', [id]);
    return r.rows[0] ?? null;
  }

  /**
   * @returns {Promise<object[]>}
   */
  async getAll() {
    const r = await this.db.query('SELECT * FROM photos ORDER BY "createdAt" DESC');
    return r.rows;
  }

  /**
   * @returns {Promise<object[]>}
   */
  async getApproved() {
    const r = await this.db.query(
      'SELECT * FROM photos WHERE approved = true ORDER BY "createdAt" DESC'
    );
    return r.rows;
  }

  /**
   * @returns {Promise<object[]>}
   */
  async getPending() {
    const r = await this.db.query(
      'SELECT * FROM photos WHERE approved = false ORDER BY "createdAt" DESC'
    );
    return r.rows;
  }

  /**
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<import('pg').QueryResult | null>}
   */
  async update(id, updates) {
    const photo = await this.getById(id);
    if (!photo) return null;

    return this.db.query(
      `UPDATE photos SET filename = $1, "originalName" = $2, "mimeType" = $3, size = $4,
       "uploaderName" = $5, "uploaderEmail" = $6, approved = $7, "updatedAt" = $8::timestamptz WHERE id = $9`,
      [
        updates.filename ?? photo.filename,
        updates.originalName ?? photo.originalName,
        updates.mimeType ?? photo.mimeType,
        updates.size !== undefined ? updates.size : photo.size,
        updates.uploaderName !== undefined ? updates.uploaderName : photo.uploaderName,
        updates.uploaderEmail !== undefined ? updates.uploaderEmail : photo.uploaderEmail,
        updates.approved !== undefined ? updates.approved === true : photo.approved === true,
        updates.updatedAt ?? photo.updatedAt,
        id,
      ]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<import('pg').QueryResult>}
   */
  async delete(id) {
    return this.db.query('DELETE FROM photos WHERE id = $1', [id]);
  }

  /**
   * @param {string} id
   * @returns {Promise<import('pg').QueryResult | null>}
   */
  async approve(id) {
    const photo = await this.getById(id);
    if (!photo) return null;
    return this.db.query(
      'UPDATE photos SET approved = true, "updatedAt" = $1::timestamptz WHERE id = $2',
      [new Date().toISOString(), id]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<import('pg').QueryResult | null>}
   */
  async reject(id) {
    const photo = await this.getById(id);
    if (!photo) return null;
    return this.db.query(
      'UPDATE photos SET approved = false, "updatedAt" = $1::timestamptz WHERE id = $2',
      [new Date().toISOString(), id]
    );
  }

  /**
   * @returns {Promise<{ total: number, approved: number, pending: number }>}
   */
  async getStats() {
    const total = await this.db.query('SELECT COUNT(*)::int AS count FROM photos');
    const approved = await this.db.query(
      'SELECT COUNT(*)::int AS count FROM photos WHERE approved = true'
    );
    const pending = await this.db.query(
      'SELECT COUNT(*)::int AS count FROM photos WHERE approved = false'
    );
    return {
      total: total.rows[0].count,
      approved: approved.rows[0].count,
      pending: pending.rows[0].count,
    };
  }
}

export default PhotoRepository;
