// InviteeRepository.js — PostgreSQL via IDb-compatible adapter

/** @typedef {import('../src/db/IDb.js').IDb} IDb */

const INVITEE_COLUMNS = new Set([
  'name',
  'partner',
  'email',
  'phone',
  'rsvp',
  'rsvpPrimary',
  'rsvpPartner',
  'inviteCode',
  'allowPlusOne',
  'plusOneName',
  'mealSelection',
  'songRequest',
  'messageToCouple',
]);

class InviteeRepository {
  /** @param {IDb} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {object} invitee
   * @returns {Promise<void>}
   */
  async create(invitee) {
    await this.db.query(
      `INSERT INTO invitees (id, name, partner, email, phone, rsvp, "rsvpPrimary", "rsvpPartner", "inviteCode", "allowPlusOne", "plusOneName", "mealSelection", "songRequest", "messageToCouple")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        invitee.id,
        invitee.name,
        invitee.partner ?? '',
        invitee.email ?? '',
        invitee.phone ?? '',
        invitee.rsvp ?? null,
        invitee.rsvpPrimary ?? null,
        invitee.rsvpPartner ?? null,
        invitee.inviteCode ?? null,
        invitee.allowPlusOne === true,
        invitee.plusOneName ?? null,
        invitee.mealSelection ?? null,
        invitee.songRequest ?? null,
        invitee.messageToCouple ?? null,
      ]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<object | null>}
   */
  async getById(id) {
    const r = await this.db.query('SELECT * FROM invitees WHERE id = $1', [id]);
    return r.rows[0] ?? null;
  }

  /**
   * @returns {Promise<object[]>}
   */
  async getAll() {
    const r = await this.db.query('SELECT * FROM invitees');
    return r.rows;
  }

  /**
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<import('pg').QueryResult | null>}
   */
  async update(id, updates) {
    const invitee = await this.getById(id);
    if (!invitee) return null;

    const merged = { ...invitee };
    for (const [key, value] of Object.entries(updates)) {
      if (INVITEE_COLUMNS.has(key)) {
        if (key === 'allowPlusOne') merged[key] = Boolean(value);
        else merged[key] = value;
      }
    }

    return this.db.query(
      `UPDATE invitees SET name = $1, partner = $2, email = $3, phone = $4, rsvp = $5,
       "rsvpPrimary" = $6, "rsvpPartner" = $7, "inviteCode" = $8,
       "allowPlusOne" = $9, "plusOneName" = $10, "mealSelection" = $11, "songRequest" = $12, "messageToCouple" = $13 WHERE id = $14`,
      [
        merged.name,
        merged.partner,
        merged.email,
        merged.phone,
        merged.rsvp,
        merged.rsvpPrimary ?? null,
        merged.rsvpPartner ?? null,
        merged.inviteCode,
        merged.allowPlusOne === true,
        merged.plusOneName,
        merged.mealSelection ?? null,
        merged.songRequest ?? null,
        merged.messageToCouple ?? null,
        id,
      ]
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<import('pg').QueryResult>}
   */
  async delete(id) {
    return this.db.query('DELETE FROM invitees WHERE id = $1', [id]);
  }
}

export default InviteeRepository;
