import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import EmailTemplateRepository from '../../../../repositories/EmailTemplateRepository.js';
import { DEFAULT_EMAIL_TEMPLATES } from '../../../seed/emailTemplates.js';
import { getDb } from '../../../db/database.js';

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
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}

export async function GET() {
  try {
    const repo = getTemplateRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    let templates = await repo.getAll();
    if (!templates || templates.length === 0) {
      for (const t of DEFAULT_EMAIL_TEMPLATES) {
        try {
          await repo.create(t);
        } catch (error) {
          console.error('Error seeding template:', error);
        }
      }
      templates = await repo.getAll();
    }
    return withCors(NextResponse.json(templates));
  } catch (error) {
    console.error('Error in GET /api/email-templates:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    const repo = getTemplateRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const body = await request.json();
    const tpl = {
      id: randomUUID(),
      name: (body.name || '').trim(),
      subject: (body.subject || '').trim(),
      text: body.text ?? '',
      html: body.html ?? '',
    };
    await repo.create(tpl);
    return withCors(NextResponse.json(tpl, { status: 201 }));
  } catch (err) {
    console.error('Error in POST /api/email-templates:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}
