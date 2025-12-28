import { NextResponse } from 'next/server';
import path from 'path';
import InviteeRepository from '../../../../../repositories/InviteeRepository.js';

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

export async function GET(_, { params }) {
  try {
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    const invitee = repo.getById(id);
    if (!invitee) return withCors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
    return withCors(NextResponse.json(invitee));
  } catch (error) {
    console.error('Error in GET /api/invitees/[id]:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    const updates = await request.json();
    console.log('PUT /api/invitees/[id] - ID:', id, 'Updates:', updates);
    
    // Validate and sanitize the updates object
    const allowedFields = ['name', 'partner', 'email', 'phone', 'rsvp', 'inviteCode', 'allowPlusOne', 'plusOneName'];
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
    
    const result = repo.update(id, sanitizedUpdates);
    if (!result) {
      return withCors(NextResponse.json({ error: 'Invitee not found' }, { status: 404 }));
    }
    
    const updated = repo.getById(id);
    console.log('PUT /api/invitees/[id] - Updated invitee:', updated);
    return withCors(NextResponse.json(updated));
  } catch (err) {
    console.error('Error in PUT /api/invitees/[id]:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}

export async function DELETE(_, { params }) {
  try {
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    repo.delete(id);
    return withCors(NextResponse.json({ success: true }));
  } catch (err) {
    console.error('Error in DELETE /api/invitees/[id]:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}


