// InviteeRepository.js
// Repository pattern for Invitee entity using Node's built-in node:sqlite

import { openDatabaseSync } from '../src/utils/openDatabaseSync.js';

class InviteeRepository {
  constructor(dbPath) {
    this.db = openDatabaseSync(dbPath);
    this._initTable();
  }

  _initTable() {
    this.db.prepare(`CREATE TABLE IF NOT EXISTS invitees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      partner TEXT,
      email TEXT,
      phone TEXT,
      rsvp TEXT,
      inviteCode TEXT,
      allowPlusOne INTEGER DEFAULT 0,
      plusOneName TEXT,
      mealSelection TEXT,
      songRequest TEXT
    )`).run();

    const migrations = [
      { column: 'plusOneName', sql: 'ALTER TABLE invitees ADD COLUMN plusOneName TEXT' },
      { column: 'mealSelection', sql: 'ALTER TABLE invitees ADD COLUMN mealSelection TEXT' },
      { column: 'songRequest', sql: 'ALTER TABLE invitees ADD COLUMN songRequest TEXT' },
    ];
    migrations.forEach(({ sql }) => {
      try {
        this.db.prepare(sql).run();
      } catch (error) {
        if (!error.message.includes('duplicate column name')) {
          console.error('Migration error:', error);
        }
      }
    });
  }

  create(invitee) {
    const stmt = this.db.prepare(`INSERT INTO invitees (id, name, partner, email, phone, rsvp, inviteCode, allowPlusOne, plusOneName, mealSelection, songRequest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    return stmt.run(
      invitee.id,
      invitee.name,
      invitee.partner ?? '',
      invitee.email ?? '',
      invitee.phone ?? '',
      invitee.rsvp ?? null,
      invitee.inviteCode ?? null,
      invitee.allowPlusOne ? 1 : 0,
      invitee.plusOneName ?? null,
      invitee.mealSelection ?? null,
      invitee.songRequest ?? null
    );
  }

  getById(id) {
    return this.db.prepare(`SELECT * FROM invitees WHERE id = ?`).get(id);
  }

  getAll() {
    return this.db.prepare(`SELECT * FROM invitees`).all();
  }

  update(id, updates) {
    const invitee = this.getById(id);
    if (!invitee) return null;
    const stmt = this.db.prepare(`UPDATE invitees SET name = ?, partner = ?, email = ?, phone = ?, rsvp = ?, inviteCode = ?, allowPlusOne = ?, plusOneName = ?, mealSelection = ?, songRequest = ? WHERE id = ?`);
    return stmt.run(
      updates.name ?? invitee.name,
      updates.partner ?? invitee.partner,
      updates.email ?? invitee.email,
      updates.phone ?? invitee.phone,
      updates.rsvp !== undefined ? updates.rsvp : invitee.rsvp,
      updates.inviteCode !== undefined ? updates.inviteCode : invitee.inviteCode,
      updates.allowPlusOne !== undefined ? (updates.allowPlusOne ? 1 : 0) : invitee.allowPlusOne,
      updates.plusOneName !== undefined ? updates.plusOneName : invitee.plusOneName,
      updates.mealSelection !== undefined ? updates.mealSelection : (invitee.mealSelection ?? null),
      updates.songRequest !== undefined ? updates.songRequest : (invitee.songRequest ?? null),
      id
    );
  }

  delete(id) {
    return this.db.prepare(`DELETE FROM invitees WHERE id = ?`).run(id);
  }
}

export default InviteeRepository;
