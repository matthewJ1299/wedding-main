import { NextResponse } from 'next/server';
import path from 'path';
import { randomUUID } from 'crypto';
import { createRequire } from 'module';
import InviteeRepository from '../../../../repositories/InviteeRepository.js';

const require = createRequire(import.meta.url);
const { allowedOriginFromNextRequest } = require('../../../../cors-origin.cjs');

export const runtime = 'nodejs';

const dbPath =
  process.env.DATABASE_PATH || process.env.DB_PATH || path.join(process.cwd(), 'data.sqlite');
let repo;
try {
  repo = new InviteeRepository(dbPath);
} catch (error) {
  console.error('Failed to initialize InviteeRepository:', error);
}

function withCors(response, request) {
  const origin = allowedOriginFromNextRequest(request);
  response.headers.set('Vary', 'Origin');
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '600');
  return response;
}

export async function OPTIONS(request) {
  return withCors(NextResponse.json({}), request);
}

export async function GET(request) {
  try {
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }), request);
    }
    const invitees = repo.getAll();
    return withCors(NextResponse.json(invitees), request);
  } catch (error) {
    console.error('Error in GET /api/invitees:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }), request);
  }
}

export async function POST(request) {
  try {
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }), request);
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
    return withCors(NextResponse.json(newInvitee, { status: 201 }), request);
  } catch (err) {
    console.error('Error in POST /api/invitees:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }), request);
  }
}


