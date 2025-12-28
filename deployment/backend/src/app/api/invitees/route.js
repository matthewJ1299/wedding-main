import { NextResponse } from 'next/server';
import path from 'path';
import { randomUUID } from 'crypto';
import InviteeRepository from '../../../../repositories/InviteeRepository.js';

export const runtime = 'nodejs';

const dbPath = path.join(process.cwd(), 'data.sqlite');
let repo;
try {
  repo = new InviteeRepository(dbPath);
} catch (error) {
  console.error('Failed to initialize InviteeRepository:', error);
}

function withCors(response) {
  const origin = process.env.ORIGIN_URL || 'http://localhost:3000';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}

export async function GET() {
  try {
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const invitees = repo.getAll();
    return withCors(NextResponse.json(invitees));
  } catch (error) {
    console.error('Error in GET /api/invitees:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const body = await request.json();
    const newInvitee = {
      id: randomUUID(),
      name: (body.name || '').trim(),
      partner: (body.partner || '').trim(),
      email: (body.email || '').trim(),
      phone: (body.phone || '').trim(),
      rsvp: body.rsvp ?? null,
      inviteCode: body.inviteCode ?? null,
      allowPlusOne: !!body.allowPlusOne,
      plusOneName: body.plusOneName ?? null,
    };
    repo.create(newInvitee);
    return withCors(NextResponse.json(newInvitee, { status: 201 }));
  } catch (err) {
    console.error('Error in POST /api/invitees:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}


