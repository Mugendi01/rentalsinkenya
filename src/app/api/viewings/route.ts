import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { viewingRequestSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = viewingRequestSchema.parse(body);

    const property = await prisma.property.findUnique({
      where: { id: validated.propertyId },
      select: { status: true },
    });
    if (!property || property.status === 'HIDDEN') {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const viewing = await prisma.viewingRequest.create({
      data: validated,
    });

    return NextResponse.json({ success: true, viewing: { id: viewing.id } }, { status: 201 });
  } catch (error: any) {
    return errorResponse(error, 'Failed to submit viewing request', 400);
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
    return errorResponse(error, 'Request failed', 500);
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
    if (status !== undefined && !['PENDING', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    if (internalNotes !== undefined && internalNotes !== null && (typeof internalNotes !== 'string' || internalNotes.length > 10000)) {
      return NextResponse.json({ error: 'Invalid internal notes' }, { status: 400 });
    }
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
    return errorResponse(error, 'Request failed', 500);
  }
}
