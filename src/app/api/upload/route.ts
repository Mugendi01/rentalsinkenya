import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import { getCurrentAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/storage';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

function matchesSignature(buffer: Buffer, mime: string): boolean {
  const ascii = (start: number, end: number) => buffer.subarray(start, end).toString('latin1');
  switch (mime) {
    case 'image/jpeg':
      return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case 'image/webp':
      return buffer.length > 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
    case 'image/avif':
      return buffer.length > 12 && ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12));
    default:
      return false;
  }
}

export async function POST(request: Request) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPEG, PNG, WEBP, and AVIF images are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowable limit of 8MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!matchesSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: 'File content does not match an allowed image format.' },
        { status: 400 }
      );
    }

    const filename = `prop_${Date.now()}_${crypto.randomUUID().slice(0, 8)}${EXTENSIONS[file.type]}`;

    const publicUrl = await uploadImage(buffer, filename, file.type);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error: any) {
    return errorResponse(error, 'File upload failed', 500);
  }
}
