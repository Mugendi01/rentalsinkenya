import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { verifyPassword, createUserSession } from '@/lib/auth';
import { verifyEmailSchema } from '@/lib/validations';
import { sendAccountVerifiedEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = verifyEmailSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Account not found. Please register.' }, { status: 404 });
    }

    if (user.isEmailVerified && user.status === 'VERIFIED') {
      // Already verified, create session
      await createUserSession({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: true,
      });

      return NextResponse.json({
        success: true,
        message: 'Your account is already verified.',
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    // Check maximum attempts limit
    if (user.verificationAttempts >= 5) {
      // Invalidate code to prevent brute force
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCodeHash: null,
          verificationCodeExpires: null,
        },
      });

      return NextResponse.json(
        { error: 'Maximum verification attempts exceeded. Please request a new verification code.' },
        { status: 429 }
      );
    }

    const hasEmailProvider = Boolean(process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY);

    // If an email provider is active, check code expiration & validity
    if (hasEmailProvider) {
      // Check expiration
      if (!user.verificationCodeExpires || new Date() > user.verificationCodeExpires || !user.verificationCodeHash) {
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new code.' },
          { status: 400 }
        );
      }

      // Verify code
      const isMatch = await verifyPassword(code, user.verificationCodeHash);
      if (!isMatch) {
        const newAttempts = user.verificationAttempts + 1;
        await prisma.user.update({
          where: { id: user.id },
          data: { verificationAttempts: newAttempts },
        });

        const remaining = 5 - newAttempts;
        return NextResponse.json(
          {
            error: remaining > 0
              ? `Invalid verification code. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`
              : 'Too many incorrect attempts. Please request a new code.',
          },
          { status: 400 }
        );
      }
    }

    // Code is valid! Mark as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'VERIFIED',
        isEmailVerified: true,
        verificationCodeHash: null,
        verificationCodeExpires: null,
        verificationAttempts: 0,
      },
    });

    // Send confirmation email
    await sendAccountVerifiedEmail(updatedUser.email, updatedUser.name).catch((err) => {
      console.error('Failed to send verified email notification:', err);
    });

    // Create session cookie
    await createUserSession({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      isEmailVerified: true,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: updatedUser.id,
        action: 'USER_VERIFIED',
        entityType: 'User',
        entityId: updatedUser.id,
        details: `User email verified: ${updatedUser.email}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Your Rentals Kenya account has been verified.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    return errorResponse(error, 'Verification failed', 400);
  }
}
