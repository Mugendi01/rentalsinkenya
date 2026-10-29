import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentUser, getCurrentAdmin } from '@/lib/auth';
import { enquirySchema } from '@/lib/validations';
import { sendBuyerEnquiryConfirmation, sendAdminEnquiryNotification } from '@/lib/email';

export async function POST(request: Request) {
  // 1. Mandatory server-side authorization check
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json(
      { error: 'Please create an account or log in to submit an enquiry.', code: 'AUTH_REQUIRED' },
      { status: 401 }
    );
  }

  // 2. Email verification requirement check
  if (!session.isVerified || session.status !== 'VERIFIED') {
    return NextResponse.json(
      { error: 'Please verify your email address before submitting an enquiry.', code: 'EMAIL_VERIFICATION_REQUIRED' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validated = enquirySchema.parse(body);

    let propertyTitle = 'General Airbnb Investment Enquiry';
    if (validated.propertyId) {
      const prop = await prisma.property.findUnique({
        where: { id: validated.propertyId },
        select: { title: true },
      });
      if (prop) propertyTitle = prop.title;
    }

    // 3. Create enquiry associated with authenticated user
    const enquiry = await prisma.enquiry.create({
      data: {
        userId: session.userId,
        propertyId: validated.propertyId || null,
        fullName: validated.fullName,
        phone: validated.phone,
        email: validated.email,
        preferredContact: validated.preferredContact,
        investmentPurpose: validated.investmentPurpose,
        budget: validated.budget || null,
        preferredViewingDate: validated.preferredViewingDate || null,
        additionalQuestions: validated.additionalQuestions || null,
        message: validated.message,
        status: 'NEW',
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            neighbourhood: true,
          },
        },
      },
    });

    // 4. Send transactional emails
    const dateFormatted = new Date().toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Buyer confirmation email
    await sendBuyerEnquiryConfirmation(validated.email, validated.fullName, propertyTitle).catch((e) => {
      console.error('Failed to send buyer confirmation:', e);
    });

    // Admin notification email
    await sendAdminEnquiryNotification({
      buyerName: validated.fullName,
      buyerEmail: validated.email,
      buyerPhone: validated.phone,
      propertyTitle,
      message: validated.message,
      date: dateFormatted,
    }).catch((e) => {
      console.error('Failed to send admin notification:', e);
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error: any) {
    return errorResponse(error, 'Failed to submit enquiry', 400);
  }
}

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  const user = await getCurrentUser();

  if (!admin && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // ADMIN: Can see all enquiries with full notes and customer details
    if (admin) {
      const where: any = {};
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const enquiries = await prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
              isEmailVerified: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              neighbourhood: true,
              town: true,
            },
          },
        },
      });

      return NextResponse.json({ enquiries });
    }

    // REGISTERED BUYER: Can ONLY see their own enquiries; admin internal notes are strictly EXCLUDED
    const enquiries = await prisma.enquiry.findMany({
      where: { userId: user!.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        propertyId: true,
        fullName: true,
        email: true,
        phone: true,
        preferredContact: true,
        investmentPurpose: true,
        budget: true,
        preferredViewingDate: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // internalNotes is strictly excluded!
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            neighbourhood: true,
            town: true,
            featuredImage: true,
          },
        },
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, internalNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (status !== undefined && !['NEW', 'CONTACTED', 'VIEWING_REQUESTED', 'VIEWING_SCHEDULED', 'NEGOTIATION', 'CONVERTED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    if (internalNotes !== undefined && internalNotes !== null && (typeof internalNotes !== 'string' || internalNotes.length > 10000)) {
      return NextResponse.json({ error: 'Invalid internal notes' }, { status: 400 });
    }
    if (status !== undefined) data.status = status;
    if (internalNotes !== undefined) data.internalNotes = internalNotes;

    const updated = await prisma.enquiry.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'LEAD_STATUS_CHANGED',
        entityType: 'Enquiry',
        entityId: id,
        details: `Updated enquiry status to ${status || 'updated notes'}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}
