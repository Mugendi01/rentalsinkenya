import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateVerificationCode, createUserSession } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // 1. Check email uniqueness
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      // If already verified or has active account
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please login instead.' },
        { status: 409 }
      );
    }

    // 2. Hash password
    const passwordHash = await hashPassword(validated.password);

    // 3. Generate 6-digit verification code
    const code = generateVerificationCode();
    const codeHash = await hashPassword(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const hasEmailProvider = Boolean(process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY);

    // 4. Create user record
    const user = await prisma.user.create({
      data: {
        name: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        country: validated.country || 'Kenya',
        preferredContact: validated.preferredContact || 'WHATSAPP',
        passwordHash,
        role: 'USER',
        status: hasEmailProvider ? 'UNVERIFIED' : 'VERIFIED',
        isEmailVerified: !hasEmailProvider,
        verificationCodeHash: hasEmailProvider ? codeHash : null,
        verificationCodeExpires: hasEmailProvider ? expiresAt : null,
        verificationAttempts: 0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isEmailVerified: true,
        role: true,
      },
    });

    if (hasEmailProvider) {
      // 5. Send verification email
      await sendVerificationEmail(user.email, user.name, code).catch((err) => {
        console.error('Failed to send verification email:', err);
      });

      // 6. Audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          entityType: 'User',
          entityId: user.id,
          details: `User registered (pending verification): ${user.email}`,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        requiresVerification: true,
        message: "We've sent a 6-digit verification code to your email address.",
        email: user.email,
      }, { status: 201 });
    } else {
      // Create session directly
      await createUserSession({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: true,
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED_AUTO_VERIFIED',
          entityType: 'User',
          entityId: user.id,
          details: `User registered and auto-verified: ${user.email}`,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        requiresVerification: false,
        message: 'Account created successfully! Welcome to Rentals Kenya.',
        user: { id: user.id, name: user.name, email: user.email },
      }, { status: 201 });
    }
  } catch (error: any) {
    if (error.errors && error.errors[0]) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
