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

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body;
    if (!to || !subject || !text) {
      return withCors(NextResponse.json({ error: 'Missing required fields' }, { status: 400 }));
    }
    await sendEmail({ to, subject, text, html });
    return withCors(NextResponse.json({ success: true }));
  } catch (err) {
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}
