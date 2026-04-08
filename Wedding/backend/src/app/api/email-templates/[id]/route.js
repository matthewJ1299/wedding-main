import { NextResponse } from 'next/server';
import EmailTemplateRepository from '../../../../../repositories/EmailTemplateRepository.js';
import { getDatabasePath } from '../../../../utils/paths.js';

export const runtime = 'nodejs';

const dbPath = getDatabasePath();
const repo = new EmailTemplateRepository(dbPath);

function withCors(response) {
  const origin = process.env.ORIGIN_URL || 'http://localhost:3000';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}

export async function GET(_, { params }) {
  const { id } = await params;
  const tpl = repo.getById(id);
  if (!tpl) return withCors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
  return withCors(NextResponse.json(tpl));
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    repo.update(id, updates);
    const updated = repo.getById(id);
    return withCors(NextResponse.json(updated));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    repo.delete(id);
    return withCors(NextResponse.json({ success: true }));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}


