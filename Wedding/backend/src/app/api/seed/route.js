import { NextResponse } from 'next/server';
import { DUMMY_INVITEES } from '../../../seed/invitees.js';
import { randomUUID } from 'crypto';
import InviteeRepository from '../../../../repositories/InviteeRepository.js';
import { getDb } from '../../../db/database.js';

export const runtime = 'nodejs';

let inviteeRepo;
let inviteeRepoTried;
function getInviteeRepo() {
  if (!inviteeRepoTried) {
    inviteeRepoTried = true;
    try {
      inviteeRepo = new InviteeRepository(getDb());
    } catch (error) {
      console.error('Failed to initialize InviteeRepository:', error);
      inviteeRepo = null;
    }
  }
  return inviteeRepo;
}

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
    const repo = getInviteeRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const existing = await repo.getAll();
    if (existing && existing.length > 0) {
      return withCors(NextResponse.json({ seeded: false, reason: 'Already has data' }));
    }
    for (const i of DUMMY_INVITEES) {
      const id = i.id || randomUUID();
      await repo.create({
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
    }
    return withCors(NextResponse.json({ seeded: true }));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}
