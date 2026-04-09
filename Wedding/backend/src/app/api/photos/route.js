import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import PhotoRepository from '../../../../repositories/PhotoRepository.js';
import { getDb } from '../../../db/database.js';
import { getUploadsDir } from '../../../utils/paths.js';

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
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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
    const repo = getPhotoRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }

    const url = new URL(request.url);
    const approved = url.searchParams.get('approved');

    let photos;
    if (approved === 'true') {
      photos = await repo.getApproved();
    } else if (approved === 'false') {
      photos = await repo.getPending();
    } else {
      photos = await repo.getAll();
    }

    return withCors(NextResponse.json(photos));
  } catch (error) {
    console.error('Error in GET /api/photos:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    const repo = getPhotoRepo();
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const uploaderName = formData.get('uploaderName');
    const uploaderEmail = formData.get('uploaderEmail');

    if (!file) {
      return withCors(NextResponse.json({ error: 'No file provided' }, { status: 400 }));
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return withCors(
        NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
          { status: 400 }
        )
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return withCors(NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 }));
    }

    const fileId = randomUUID();
    const fileExtension = path.extname(file.name);
    const filename = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const photo = {
      id: fileId,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploaderName: uploaderName || null,
      uploaderEmail: uploaderEmail || null,
      approved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await repo.create(photo);

    return withCors(NextResponse.json(photo, { status: 201 }));
  } catch (error) {
    console.error('Error in POST /api/photos:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}
