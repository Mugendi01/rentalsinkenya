import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { getCurrentUser, hashPassword, generateVerificationCode } from '@/lib/auth';
import { userProfileSchema } from '@/lib/validations';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      country: true,
      preferredContact: true,
      isEmailVerified: true,
      status: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          enquiries: true,
          viewingRequests: true,
          savedListings: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = userProfileSchema.parse(body);

    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const emailChanged = validated.email.toLowerCase() !== currentUser.email.toLowerCase();

    // If email is changing, check uniqueness
    if (emailChanged) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validated.email },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: 'An account with this email address already exists.' },
          { status: 409 }
        );
      }
    }

    const dataToUpdate: any = {
      name: validated.name,
      phone: validated.phone,
      country: validated.country || 'Kenya',
      preferredContact: validated.preferredContact,
    };

    let emailRequiresVerification = false;

    if (emailChanged) {
      // Re-verification required for changed email address
      const code = generateVerificationCode();
      const codeHash = await hashPassword(code);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      dataToUpdate.email = validated.email;
      dataToUpdate.isEmailVerified = false;
      dataToUpdate.status = 'UNVERIFIED';
      dataToUpdate.verificationCodeHash = codeHash;
      dataToUpdate.verificationCodeExpires = expiresAt;
      dataToUpdate.verificationAttempts = 0;

      emailRequiresVerification = true;

      await sendVerificationEmail(validated.email, validated.name, code).catch((err) => {
        console.error('Failed to send verification for changed email:', err);
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        preferredContact: true,
        isEmailVerified: true,
        status: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      emailRequiresVerification,
      message: emailRequiresVerification
        ? 'Profile updated. Please enter the verification code sent to your new email address.'
        : 'Profile updated successfully.',
    });
  } catch (error: any) {
    return errorResponse(error, 'Failed to update profile', 400);
  }
}
