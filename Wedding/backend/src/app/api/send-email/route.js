import { NextResponse } from 'next/server';
import { sendEmail } from '../../../emailModule.js';

function withCors(response) {
  const origin = process.env.ORIGIN_URL || 'http://localhost:3000';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function GET() {
  return withCors(NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }));
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}

function validateSendEmailBody(body) {
  const { to, subject, text, html } = body;
  const missingFields = [];

  if (!String(to ?? '').trim()) {
    missingFields.push('to');
  }
  if (!String(subject ?? '').trim()) {
    missingFields.push('subject');
  }

  const textTrim = String(text ?? '').trim();
  const htmlTrim = String(html ?? '').trim();
  if (!textTrim && !htmlTrim) {
    missingFields.push('text');
    missingFields.push('html');
  }

  if (missingFields.length === 0) {
    return { ok: true, to: String(to).trim(), subject: String(subject).trim(), text: textTrim, html: htmlTrim };
  }

  const listed = missingFields.join(', ');
  let hint = '';
  if (!textTrim && !htmlTrim) {
    hint = ' Provide a non-empty message body: either `text` (plain) or `html` (or both).';
  }
  return {
    ok: false,
    response: NextResponse.json(
      {
        error: `Missing or empty required field(s): ${listed}.${hint}`,
        missingFields,
      },
      { status: 400 }
    ),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validated = validateSendEmailBody(body);
    if (!validated.ok) {
      return withCors(validated.response);
    }
    const { to, subject, text, html } = validated;
    await sendEmail({ to, subject, text, html });
    return withCors(NextResponse.json({ success: true }));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}
