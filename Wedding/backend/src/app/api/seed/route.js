import { NextResponse } from 'next/server';
import { DUMMY_INVITEES } from '../../../seed/invitees.js';
import { randomUUID } from 'crypto';
import InviteeRepository from '../../../../repositories/InviteeRepository.js';
import { getDatabasePath } from '../../../utils/paths.js';

export const runtime = 'nodejs';

const dbPath = getDatabasePath();
const repo = new InviteeRepository(dbPath);

function withCors(response) {
  const origin = process.env.ORIGIN_URL || 'http://localhost:3000';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}

export async function POST() {
  try {
    const existing = repo.getAll();
    if (existing && existing.length > 0) {
      return withCors(NextResponse.json({ seeded: false, reason: 'Already has data' }));
    }
    DUMMY_INVITEES.forEach((i) => {
      const id = i.id || randomUUID();
      repo.create({
        id,
        name: (i.name || '').trim(),
        partner: (i.partner || '').trim(),
        email: (i.email || '').trim(),
        phone: (i.phone || '').trim(),
        rsvp: i.rsvp ?? null,
        inviteCode: i.inviteCode ?? null,
        allowPlusOne: !!i.allowPlusOne,
        plusOneName: i.plusOneName ?? null,
      });
    });
    return withCors(NextResponse.json({ seeded: true }));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}


