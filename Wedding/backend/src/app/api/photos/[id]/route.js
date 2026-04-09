import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import PhotoRepository from '../../../../../repositories/PhotoRepository.js';
import { getDb } from '../../../../db/database.js';
import { getUploadsDir } from '../../../../utils/paths.js';

export const runtime = 'nodejs';

let photoRepo;
let photoRepoTried;
function getPhotoRepo() {
  if (!photoRepoTried) {
    photoRepoTried = true;
    try {
      photoRepo = new PhotoRepository(getDb());
    } catch (error) {
      console.error('Failed to initialize PhotoRepository:', error);
      photoRepo = null;
    }
  }
  return photoRepo;
}

const uploadsDir = getUploadsDir();

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
    const repo = getPhotoRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }

    const { id } = await params;
    const photo = await repo.getById(id);

    if (!photo) {
      return withCors(NextResponse.json({ error: 'Photo not found' }, { status: 404 }));
    }

    const filePath = path.join(uploadsDir, photo.filename);

    if (!fs.existsSync(filePath)) {
      return withCors(NextResponse.json({ error: 'Photo file not found' }, { status: 404 }));
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': photo.mimeType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': process.env.ORIGIN_URL || 'http://localhost:3000',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/photos/[id]:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    const repo = getPhotoRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }

    const { id } = await params;
    const updates = await request.json();

    const allowedFields = ['uploaderName', 'uploaderEmail', 'approved'];
    const sanitizedUpdates = {};

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'approved') {
          sanitizedUpdates[key] = Boolean(value);
        } else if (typeof value === 'string') {
          sanitizedUpdates[key] = value.trim();
        } else {
          sanitizedUpdates[key] = value;
        }
      }
    }

    sanitizedUpdates.updatedAt = new Date().toISOString();

    const result = await repo.update(id, sanitizedUpdates);
    if (!result) {
      return withCors(NextResponse.json({ error: 'Photo not found' }, { status: 404 }));
    }

    const updated = await repo.getById(id);
    return withCors(NextResponse.json(updated));
  } catch (error) {
    console.error('Error in PUT /api/photos/[id]:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function DELETE(_, { params }) {
  try {
    const repo = getPhotoRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }

    const { id } = await params;
    const photo = await repo.getById(id);

    if (!photo) {
      return withCors(NextResponse.json({ error: 'Photo not found' }, { status: 404 }));
    }

    const filePath = path.join(uploadsDir, photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await repo.delete(id);

    return withCors(NextResponse.json({ success: true, message: 'Photo deleted successfully' }));
  } catch (error) {
    console.error('Error in DELETE /api/photos/[id]:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
