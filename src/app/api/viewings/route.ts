import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { viewingRequestSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = viewingRequestSchema.parse(body);

    const viewing = await prisma.viewingRequest.create({
      data: validated,
    });

    return NextResponse.json({ success: true, viewing }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit viewing request' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const viewings = await prisma.viewingRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            neighbourhood: true,
          },
        },
      },
    });

    return NextResponse.json({ viewings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, internalNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Viewing ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (internalNotes !== undefined) data.internalNotes = internalNotes;

    const updated = await prisma.viewingRequest.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'VIEWING_STATUS_CHANGED',
        entityType: 'ViewingRequest',
        entityId: id,
        details: `Updated viewing status to ${status || 'updated notes'}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, viewing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
