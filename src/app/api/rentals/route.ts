import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { rentalFormSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {
      OR: [
        { operationalAssets: 'RENTAL' },
        { isAirbnbReady: false },
      ],
    };

    const isAdmin = !!(await getCurrentAdmin());
    if (status && status !== 'ALL' && (isAdmin || status !== 'HIDDEN')) {
      where.status = status;
    }
    if (!isAdmin && where.status === undefined) {
      where.status = { not: 'HIDDEN' };
    }

    if (search && search.trim()) {
      where.AND = [
        {
          OR: [
            { title: { contains: search.trim() } },
            { neighbourhood: { contains: search.trim() } },
            { town: { contains: search.trim() } },
            { address: { contains: search.trim() } },
          ],
        },
      ];
    }

    const rentals = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        amenities: { include: { amenity: true } },
      },
    });

    return NextResponse.json({ rentals });
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
    const validated = rentalFormSchema.parse(body);

    // Ensure unique slug
    let slug = validated.slug.trim().toLowerCase();
    const existing = await prisma.property.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const {
      amenities,
      images,
      contactName,
      contactPhone,
      contactEmail,
      viewingInstructions,
      ...propData
    } = validated;

    const contactJson = JSON.stringify({
      contactName: contactName || '',
      contactPhone: contactPhone || '',
      contactEmail: contactEmail || '',
      viewingInstructions: viewingInstructions || '',
    });

    const featuredImage = propData.featuredImage || (images && images.length > 0 ? images[0] : null);

    const property = await prisma.property.create({
      data: {
        title: propData.title,
        slug,
        description: propData.description,
        propertyType: propData.propertyType,
        bedrooms: propData.bedrooms,
        bathrooms: propData.bathrooms,
        sizeSqft: propData.sizeSqft || null,
        furnishing: propData.furnishing,
        county: propData.county,
        town: propData.town,
        neighbourhood: propData.neighbourhood,
        address: propData.address || null,
        price: propData.monthlyRent, // stored as primary pricing figure
        monthlyRent: propData.monthlyRent,
        landlordDeposit: propData.landlordDeposit || null,
        serviceCharge: propData.serviceCharge || null,
        leaseTerms: propData.leaseTerms || null,
        investmentNotes: contactJson,
        operationalAssets: 'RENTAL',
        isAirbnbReady: false,
        isFeatured: propData.isFeatured,
        status: propData.status,
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

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'RENTAL_CREATED',
        entityType: 'Property',
        entityId: property.id,
        details: `Created rental listing: "${property.title}" (${property.slug}) at KES ${property.monthlyRent}/month`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, rental: property });
  } catch (error: any) {
    return errorResponse(error, 'Failed to create rental listing', 400);
  }
}
