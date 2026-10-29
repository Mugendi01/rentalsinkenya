import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = resetPasswordSchema.parse(body);
    const email = body.email ? String(body.email).toLowerCase().trim() : null;

    let user;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      // Find candidate users with unexpired reset token
      const candidates = await prisma.user.findMany({
        where: {
          resetTokenHash: { not: null },
          resetTokenExpires: { gt: new Date() },
        },
      });

      for (const candidate of candidates) {
        if (candidate.resetTokenHash && await verifyPassword(validated.token, candidate.resetTokenHash)) {
          user = candidate;
          break;
        }
      }
    }

    if (!user || !user.resetTokenHash || !user.resetTokenExpires) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date() > user.resetTokenExpires) {
      return NextResponse.json(
        { error: 'Password reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify token
    const isTokenMatch = await verifyPassword(validated.token, user.resetTokenHash);
    if (!isTokenMatch) {
      return NextResponse.json(
        { error: 'Invalid password reset token.' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(validated.password);

    // Invalidate token and update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetTokenHash: null,
        resetTokenExpires: null,
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET',
        entityType: 'User',
        entityId: user.id,
        details: `Password reset successfully for ${user.email}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully reset. Please log in with your new password.',
    });
  } catch (error: any) {
    return errorResponse(error, 'Failed to reset password', 400);
  }
}
