import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: session.userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            bedrooms: true,
            bathrooms: true,
            neighbourhood: true,
            town: true,
            featuredImage: true,
            estNightlyRate: true,
            estOccupancyRate: true,
            estRoiPercentage: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const existing = await prisma.savedListing.findUnique({
      where: {
        userId_propertyId: {
          userId: session.userId,
          propertyId,
        },
      },
    });

    if (existing) {
      // Toggle off: remove
      await prisma.savedListing.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false, message: 'Removed from saved listings' });
    } else {
      // Toggle on: add
      await prisma.savedListing.create({
        data: {
          userId: session.userId,
          propertyId,
        },
      });
      return NextResponse.json({ saved: true, message: 'Saved to your dashboard' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
