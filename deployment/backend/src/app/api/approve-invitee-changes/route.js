import { NextResponse } from 'next/server';
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
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}));
}

export async function GET(request) {
  try {
    const repo = getInviteeRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { searchParams } = new URL(request.url);
    const inviteeId = searchParams.get('inviteeId');
    const changesParam = searchParams.get('changes');

    if (!inviteeId || !changesParam) {
      return withCors(
        NextResponse.json(
          { error: 'Missing required parameters: inviteeId and changes' },
          { status: 400 }
        )
      );
    }

    const changes = JSON.parse(decodeURIComponent(changesParam));

    const currentInvitee = await repo.getById(inviteeId);
    if (!currentInvitee) {
      return withCors(NextResponse.json({ error: 'Invitee not found' }, { status: 404 }));
    }

    await repo.update(inviteeId, changes);
    const updatedInvitee = await repo.getById(inviteeId);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Changes Approved</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .success { color: #2e7d32; font-size: 24px; margin-bottom: 20px; }
          .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">Changes Approved Successfully!</div>
          <p>Invitee details have been updated for <strong>${updatedInvitee.name}</strong>.</p>
          <div class="details">
            <h3>Updated Details:</h3>
            <p><strong>Name:</strong> ${updatedInvitee.name}</p>
            <p><strong>Email:</strong> ${updatedInvitee.email}</p>
            <p><strong>Phone:</strong> ${updatedInvitee.phone}</p>
          </div>
          <p>You can close this window now.</p>
        </div>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': process.env.ORIGIN_URL || 'http://localhost:3000',
      },
    });
  } catch (err) {
    console.error('Error approving invitee changes via GET:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    const repo = getInviteeRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    const { inviteeId, changes } = await request.json();

    if (!inviteeId || !changes) {
      return withCors(
        NextResponse.json(
          { error: 'Missing required fields: inviteeId and changes' },
          { status: 400 }
        )
      );
    }

    const currentInvitee = await repo.getById(inviteeId);
    if (!currentInvitee) {
      return withCors(NextResponse.json({ error: 'Invitee not found' }, { status: 404 }));
    }

    await repo.update(inviteeId, changes);
    const updatedInvitee = await repo.getById(inviteeId);

    return withCors(
      NextResponse.json({
        success: true,
        message: 'Invitee details updated successfully',
        invitee: updatedInvitee,
      })
    );
  } catch (err) {
    console.error('Error approving invitee changes:', err);
    return withCors(NextResponse.json({ error: err.message }, { status: 500 }));
  }
}
