import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';
import { generateResetToken, hashPassword } from '@/lib/auth';
import { forgotPasswordSchema } from '@/lib/validations';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const genericSuccessResponse = NextResponse.json({
      success: true,
      message: 'If an account exists with this email address, you will receive password reset instructions shortly.',
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.status === 'DISABLED') {
      // Do not reveal whether user exists
      return genericSuccessResponse;
    }

    // Generate secure single-use token
    const token = generateResetToken();
    const tokenHash = await hashPassword(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpires: expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    await sendPasswordResetEmail(user.email, user.name, resetLink, token).catch((err) => {
      console.error('Failed to send reset email:', err);
    });

    return genericSuccessResponse;
  } catch (error: any) {
    return errorResponse(error, 'Failed to process request', 400);
  }
}
