import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  verifyPassword,
  createAdminSession,
  createUserSession,
  destroyAdminSession,
  destroyUserSession,
  getCurrentUser,
} from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);
    const email = validated.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check account lockout if user exists
    if (user && user.lockUntil && new Date() < user.lockUntil) {
      const minutesRemaining = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Too many failed login attempts. Please try again in ${minutesRemaining} minutes.` },
        { status: 429 }
      );
    }

    // Generic error message to prevent account enumeration
    const genericAuthError = 'Email or password is incorrect.';

    if (!user) {
      return NextResponse.json({ error: genericAuthError }, { status: 401 });
    }

    // Check if account has been disabled by admin
    if (user.status === 'DISABLED') {
      return NextResponse.json(
        { error: 'This account has been disabled. Please contact Rentals Kenya support for assistance.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(validated.password, user.passwordHash);

    if (!isValid) {
      // Increment failed attempts and lock out temporarily if >= 5
      const newFailedCount = (user.failedLoginAttempts || 0) + 1;
      const dataToUpdate: any = { failedLoginAttempts: newFailedCount };

      if (newFailedCount >= 5) {
        dataToUpdate.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute temporary block
      }

      await prisma.user.update({
        where: { id: user.id },
        data: dataToUpdate,
      });

      return NextResponse.json({ error: genericAuthError }, { status: 401 });
    }

    // Check if email is verified
    if (!user.isEmailVerified || user.status === 'UNVERIFIED') {
      return NextResponse.json(
        {
          unverified: true,
          email: user.email,
          message: 'Please verify your email address before continuing.',
        },
        { status: 403 }
      );
    }

    // Reset failed attempts & record last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Create session depending on role
    if (user.role === 'ADMIN') {
      await createAdminSession({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

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
        action: user.role === 'ADMIN' ? 'ADMIN_LOGIN' : 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        details: `Successful login for ${user.email}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error: any) {
    if (error.errors && error.errors[0]) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  await destroyAdminSession();
  await destroyUserSession();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}
