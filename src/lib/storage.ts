import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'property-images';

function getSupabaseUrl(): string | null {
  const explicit = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  // Derive from the pooler connection string: postgres.[PROJECT-REF]:password@...
  const dbUrl = process.env.DATABASE_URL || '';
  const match = dbUrl.match(/postgres(?:ql)?:\/\/postgres\.([a-z0-9]+):/i);
  return match ? `https://${match[1]}.supabase.co` : null;
}

function getSupabaseKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function isCloudStorageConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

async function createPublicBucket(baseUrl: string, key: string) {
  const res = await fetch(`${baseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    if (!/already exists/i.test(text)) {
      throw new Error(`Failed to create storage bucket "${BUCKET}": ${text}`);
    }
  }
}

async function uploadToSupabase(buffer: Buffer, filename: string, contentType: string) {
  const baseUrl = getSupabaseUrl()!;
  const key = getSupabaseKey()!;
  const objectPath = `properties/${filename}`;

  const doUpload = () =>
    fetch(`${baseUrl}/storage/v1/object/${BUCKET}/${objectPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        'Content-Type': contentType,
        'Cache-Control': 'max-age=31536000',
        'x-upsert': 'true',
      },
      body: new Uint8Array(buffer),
    });

  let res = await doUpload();
  if (!res.ok) {
    const text = await res.text();
    if (/bucket not found/i.test(text)) {
      await createPublicBucket(baseUrl, key);
      res = await doUpload();
      if (!res.ok) throw new Error(`Storage upload failed: ${await res.text()}`);
    } else {
      throw new Error(`Storage upload failed: ${text}`);
    }
  }

  return `${baseUrl}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

async function uploadToLocalDisk(buffer: Buffer, filename: string) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function uploadImage(buffer: Buffer, filename: string, contentType: string) {
  if (isCloudStorageConfigured()) {
    return uploadToSupabase(buffer, filename, contentType);
  }

  if (process.env.VERCEL) {
    throw new Error(
      'Image storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY (and optionally SUPABASE_URL) in your Vercel environment variables.'
    );
  }

  return uploadToLocalDisk(buffer, filename);
}
