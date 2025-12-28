import { NextResponse } from 'next/server';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';
import PhotoRepository from '../../../../repositories/PhotoRepository.js';

export const runtime = 'nodejs';

const dbPath = path.join(process.cwd(), 'data.sqlite');
let repo;
try {
  repo = new PhotoRepository(dbPath);
} catch (error) {
  console.error('Failed to initialize PhotoRepository:', error);
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
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
    if (!repo) {
      return withCors(NextResponse.json({ error: 'Database not initialized' }, { status: 500 }));
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const approved = url.searchParams.get('approved');
    
    let photos;
    if (approved === 'true') {
      photos = repo.getApproved();
    } else if (approved === 'false') {
      photos = repo.getPending();
    } else {
      photos = repo.getAll();
    }
    
    return withCors(NextResponse.json(photos));
  } catch (error) {
    console.error('Error in GET /api/photos:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return withCors(NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      }, { status: 400 }));
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return withCors(NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 }));
    }

    // Generate unique filename
    const fileId = randomUUID();
    const fileExtension = path.extname(file.name);
    const filename = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file to disk
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Create photo record
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
      updatedAt: new Date().toISOString()
    };

    repo.create(photo);

    return withCors(NextResponse.json(photo, { status: 201 }));
  } catch (error) {
    console.error('Error in POST /api/photos:', error);
    return withCors(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}



