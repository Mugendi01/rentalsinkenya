import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { rentalFormSchema } from '@/lib/validations';

interface RouteProps {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const rental = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        amenities: { include: { amenity: true } },
      },
    });

    if (!rental) {
      return NextResponse.json({ error: 'Rental listing not found' }, { status: 404 });
    }

    // Parse contact details from investmentNotes if available
    let contactInfo: any = {};
    if (rental.investmentNotes) {
      try {
        contactInfo = JSON.parse(rental.investmentNotes);
      } catch {
        contactInfo = {};
      }
    }

    return NextResponse.json({ rental: { ...rental, contactInfo } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = rentalFormSchema.parse(body);

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

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: {
        title: propData.title,
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
        price: propData.monthlyRent,
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

    // Update images
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

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'RENTAL_UPDATED',
        entityType: 'Property',
        entityId: params.id,
        details: `Updated rental listing: "${updated.title}" at KES ${updated.monthlyRent}/month`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, rental: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update rental listing' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, isFeatured } = body;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    const updated = await prisma.property.update({
      where: { id: params.id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'RENTAL_STATUS_CHANGED',
        entityType: 'Property',
        entityId: params.id,
        details: `Toggled rental listing status: ${JSON.stringify(data)}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, rental: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rental = await prisma.property.findUnique({ where: { id: params.id } });
    if (!rental) {
      return NextResponse.json({ error: 'Rental listing not found' }, { status: 404 });
    }

    await prisma.property.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'RENTAL_DELETED',
        entityType: 'Property',
        entityId: params.id,
        details: `Deleted rental listing: "${rental.title}"`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
