import { NextResponse } from 'next/server';
import EmailTemplateRepository from '../../../../../repositories/EmailTemplateRepository.js';
import { getDb } from '../../../../db/database.js';

export const runtime = 'nodejs';

let templateRepo;
let templateRepoTried;
function getTemplateRepo() {
  if (!templateRepoTried) {
    templateRepoTried = true;
    try {
      templateRepo = new EmailTemplateRepository(getDb());
    } catch (error) {
      console.error('Failed to initialize EmailTemplateRepository:', error);
      templateRepo = null;
    }
  }
  return templateRepo;
}

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
  try {
    const repo = getTemplateRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    const tpl = await repo.getById(id);
    if (!tpl) return withCors(NextResponse.json({ error: 'Not found' }, { status: 404 }));
    return withCors(NextResponse.json(tpl));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    const repo = getTemplateRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    const updates = await request.json();
    await repo.update(id, updates);
    const updated = await repo.getById(id);
    return withCors(NextResponse.json(updated));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}

export async function DELETE(_, { params }) {
  try {
    const repo = getTemplateRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { id } = await params;
    await repo.delete(id);
    return withCors(NextResponse.json({ success: true }));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}
