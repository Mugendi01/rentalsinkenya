import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

interface RouteProps {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteProps) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const original = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        amenities: true,
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newTitle = `${original.title} (Copy)`;

    const { id, createdAt, updatedAt, images, amenities, viewsCount, ...fields } = original;

    const copy = await prisma.property.create({
      data: {
        ...fields,
        title: newTitle,
        slug: newSlug,
        status: 'AVAILABLE',
        isFeatured: false,
      },
    });

    // Copy images
    for (const img of images) {
      await prisma.propertyImage.create({
        data: {
          propertyId: copy.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
          caption: img.caption,
        },
      });
    }

    // Copy amenities
    for (const pa of amenities) {
      await prisma.propertyAmenity.create({
        data: {
          propertyId: copy.id,
          amenityId: pa.amenityId,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'PROPERTY_DUPLICATED',
        entityType: 'Property',
        entityId: copy.id,
        details: `Duplicated "${original.title}" into new property "${copy.title}"`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, property: copy });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}
