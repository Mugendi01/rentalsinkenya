import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateVerificationCode } from '@/lib/auth';
import { resendCodeSchema } from '@/lib/validations';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = resendCodeSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Do not disclose whether email exists
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a new verification code has been sent.',
      });
    }

    if (user.isEmailVerified && user.status === 'VERIFIED') {
      return NextResponse.json({
        success: true,
        message: 'This account is already verified. Please login.',
        isVerified: true,
      });
    }

    // Generate new code and invalidate previous code
    const code = generateVerificationCode();
    const codeHash = await hashPassword(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCodeHash: codeHash,
        verificationCodeExpires: expiresAt,
        verificationAttempts: 0,
      },
    });

    await sendVerificationEmail(user.email, user.name, code).catch((err) => {
      console.error('Failed to dispatch resend email:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'A new 6-digit verification code has been sent to your email address.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to resend code' }, { status: 400 });
  }
}
