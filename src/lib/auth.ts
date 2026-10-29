import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from './prisma';

import { redirect } from 'next/navigation';
import { getJwtSecretKey } from './jwt-secret';


export const USER_COOKIE_NAME = 'rentals_user_token';
export const ADMIN_COOKIE_NAME = 'rentals_admin_token';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified?: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a cryptographically random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Generates a cryptographically random token for password resets
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Password Strength Evaluator
 */
export function evaluatePasswordStrength(password: string): {
  score: number;
  label: 'Weak' | 'Medium' | 'Strong';
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
} {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let criteriaCount = 0;
  if (hasMinLength) criteriaCount++;
  if (hasUpper) criteriaCount++;
  if (hasLower) criteriaCount++;
  if (hasNumber) criteriaCount++;
  if (hasSpecial) criteriaCount++;

  let label: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  if (criteriaCount >= 5) {
    label = 'Strong';
  } else if (criteriaCount >= 3 && hasMinLength) {
    label = 'Medium';
  }

  return {
    score: criteriaCount,
    label,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  };
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Retrieve current authenticated User with database verification
 */
export async function getCurrentUser(): Promise<(SessionPayload & { isVerified: boolean; status: string }) | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value || cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  // Verify directly against database for real-time revocation and status check
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isEmailVerified: true, status: true },
    });

    if (!dbUser || dbUser.status === 'DISABLED') {
      return null;
    }

    return {
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      isVerified: dbUser.isEmailVerified && dbUser.status === 'VERIFIED',
      status: dbUser.status,
    };
  } catch {
    return null;
  }
}

/**
 * Retrieve current authenticated Admin
 */
export async function getCurrentAdmin(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || payload.role !== 'ADMIN') return null;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    if (!dbUser || dbUser.role !== 'ADMIN' || dbUser.status === 'DISABLED') {
      return null;
    }

    return {
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
    };
  } catch {
    return null;
  }
}

/**
 * Server-component guard for admin pages: redirects to the admin login when the
 * caller is not a verified, active admin (middleware only checks the token signature).
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getCurrentAdmin();
  if (!session) redirect('/admin/login');
  return session;
}

/**
 * Create buyer or user session
 */
export async function createUserSession(user: { id: string; email: string; name: string; role: string; isEmailVerified?: boolean }) {
  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  });

  const cookieStore = cookies();
  cookieStore.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

/**
 * Create admin session
 */
export async function createAdminSession(user: { id: string; email: string; name: string; role: string }) {
  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

/**
 * Destroy sessions
 */
export async function destroyUserSession() {
  const cookieStore = cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}

export async function destroyAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
