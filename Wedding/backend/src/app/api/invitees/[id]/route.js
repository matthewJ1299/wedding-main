import { NextResponse } from 'next/server';
import InviteeRepository from '../../../../../repositories/InviteeRepository.js';
import { getDb } from '../../../../db/database.js';

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
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}

export async function GET(_, { params }) {
  try {
    const repo = getInviteeRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    const invitee = await repo.getById(id);
    if (!invitee) return withCors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
    return withCors(NextResponse.json(invitee));
  } catch (error) {
    console.error('Error in GET /api/invitees/[id]:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    const repo = getInviteeRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    const updates = await request.json();
    console.log('PUT /api/invitees/[id] - ID:', id, 'Updates:', updates);

    const allowedFields = ['name', 'partner', 'email', 'phone', 'rsvp', 'inviteCode', 'allowPlusOne', 'plusOneName', 'plusOneEmail', 'plusOnePhone', 'mealSelection', 'songRequest', 'messageToCouple'];
    const sanitizedUpdates = {};

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'allowPlusOne') {
          sanitizedUpdates[key] = Boolean(value);
        } else if (typeof value === 'string') {
          sanitizedUpdates[key] = value.trim();
        } else {
          sanitizedUpdates[key] = value;
        }
      }
    }

    console.log('PUT /api/invitees/[id] - Sanitized updates:', sanitizedUpdates);

    const result = await repo.update(id, sanitizedUpdates);
    if (!result) {
      return withCors(NextResponse.json({ error: 'Invitee not found' }, { status: 404 }));
    }

    const updated = await repo.getById(id);
    console.log('PUT /api/invitees/[id] - Updated invitee:', updated);
    return withCors(NextResponse.json(updated));
  } catch (err) {
    console.error('Error in PUT /api/invitees/[id]:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}

export async function DELETE(_, { params }) {
  try {
    const repo = getInviteeRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    await repo.delete(id);
    return withCors(NextResponse.json({ success: true }));
  } catch (err) {
    console.error('Error in DELETE /api/invitees/[id]:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}
