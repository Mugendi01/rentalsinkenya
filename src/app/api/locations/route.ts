import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ locations });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}

export async function POST(request: Request) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, county, description, imageUrl, isFeatured } = body;

    if (!name || !county) {
      return NextResponse.json({ error: 'Name and county are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const location = await prisma.location.create({
      data: {
        name,
        slug,
        county,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        isFeatured: Boolean(isFeatured),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'LOCATION_CREATED',
        entityType: 'Location',
        entityId: location.id,
        details: `Created strategic location: ${location.name}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, location }, { status: 201 });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 400);
  }
}

export async function DELETE(request: Request) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.location.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}
