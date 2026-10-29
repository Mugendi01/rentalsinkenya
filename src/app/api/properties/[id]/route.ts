import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { propertyFormSchema } from '@/lib/validations';

interface RouteProps {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        amenities: { include: { amenity: true } },
      },
    });

    if (!property || (property.status === 'HIDDEN' && !(await getCurrentAdmin()))) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = propertyFormSchema.parse(body);

    const { amenities, images, ...propData } = validated;

    const featuredImage = propData.featuredImage || (images.length > 0 ? images[0] : null);

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...propData,
        featuredImage,
      },
    });

    // Update images if provided
    if (images && images.length > 0) {
      await prisma.propertyImage.deleteMany({ where: { propertyId: params.id } });
      for (let i = 0; i < images.length; i++) {
        await prisma.propertyImage.create({
          data: {
            propertyId: params.id,
            imageUrl: images[i],
            isPrimary: i === 0,
            displayOrder: i,
            caption: `${updated.title} - Photo ${i + 1}`,
          },
        });
      }
    }

    // Update amenities
    if (amenities) {
      await prisma.propertyAmenity.deleteMany({ where: { propertyId: params.id } });
      for (const aId of amenities) {
        await prisma.propertyAmenity.create({
          data: {
            propertyId: params.id,
            amenityId: aId,
          },
        }).catch(() => {});
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'PROPERTY_UPDATED',
        entityType: 'Property',
        entityId: params.id,
        details: `Updated property: "${updated.title}"`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    return errorResponse(error, 'Failed to update property', 400);
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const property = await prisma.property.findUnique({ where: { id: params.id } });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    await prisma.property.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'PROPERTY_DELETED',
        entityType: 'Property',
        entityId: params.id,
        details: `Deleted property: "${property.title}"`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, isFeatured, isAirbnbReady } = body;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (isAirbnbReady !== undefined) data.isAirbnbReady = isAirbnbReady;

    const updated = await prisma.property.update({
      where: { id: params.id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'PROPERTY_PATCHED',
        entityType: 'Property',
        entityId: params.id,
        details: `Quick updated property flags: ${JSON.stringify(data)}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}
