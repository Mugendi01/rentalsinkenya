import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { propertyFormSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const isAdmin = !!(await getCurrentAdmin());
    const where: any = {};
    if (status && status !== 'ALL' && (isAdmin || status !== 'HIDDEN')) {
      where.status = status;
    }
    if (!isAdmin && where.status === undefined) {
      where.status = { not: 'HIDDEN' };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        amenities: { include: { amenity: true } },
      },
    });

    return NextResponse.json({ properties });
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
    const validated = propertyFormSchema.parse(body);

    // Ensure unique slug
    let slug = validated.slug.trim().toLowerCase();
    const existing = await prisma.property.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const { amenities, images, ...propData } = validated;

    // Use primary image as featuredImage if not provided
    const featuredImage = propData.featuredImage || (images.length > 0 ? images[0] : null);

    const property = await prisma.property.create({
      data: {
        ...propData,
        slug,
        featuredImage,
      },
    });

    // Save Images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.propertyImage.create({
          data: {
            propertyId: property.id,
            imageUrl: images[i],
            isPrimary: i === 0,
            displayOrder: i,
            caption: `${property.title} - Photo ${i + 1}`,
          },
        });
      }
    }

    // Save Amenities
    if (amenities && amenities.length > 0) {
      for (const aId of amenities) {
        await prisma.propertyAmenity.create({
          data: {
            propertyId: property.id,
            amenityId: aId,
          },
        }).catch(() => {});
      }
    }

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'PROPERTY_CREATED',
        entityType: 'Property',
        entityId: property.id,
        details: `Created property: "${property.title}" (${property.slug})`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error: any) {
    return errorResponse(error, 'Failed to create property', 400);
  }
}
