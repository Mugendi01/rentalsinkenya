import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getJwtSecretKey } from '@/lib/jwt-secret';
import { rateLimit } from '@/lib/rate-limit';

const ADMIN_COOKIE_NAME = 'rentals_admin_token';
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// [path prefix, max requests, window in ms] applied per client IP to mutating requests
const RATE_LIMITS: Array<[string, number, number]> = [
  ['/api/auth/login', 10, 10 * 60 * 1000],
  ['/api/auth/register', 5, 60 * 60 * 1000],
  ['/api/auth/forgot-password', 5, 60 * 60 * 1000],
  ['/api/auth/reset-password', 10, 60 * 60 * 1000],
  ['/api/auth/resend-code', 5, 60 * 60 * 1000],
  ['/api/auth/verify-email', 10, 10 * 60 * 1000],
  ['/api/enquiries', 10, 60 * 60 * 1000],
  ['/api/viewings', 10, 60 * 60 * 1000],
  ['/api/upload', 60, 10 * 60 * 1000],
  ['/api/', 120, 60 * 1000],
];

function getClientIp(request: NextRequest): string {
  return (
    request.ip ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) {
    // Browsers always send Origin on cross-site POST/PUT/PATCH/DELETE; fall back to Referer.
    const referer = request.headers.get('referer');
    if (!referer) return true;
    try {
      return new URL(referer).host === request.headers.get('host');
    } catch {
      return false;
    }
  }
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

async function isAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    if (MUTATING_METHODS.has(request.method)) {
      if (!isSameOrigin(request)) {
        return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 });
      }

      const rule = RATE_LIMITS.find(([prefix]) => pathname.startsWith(prefix))!;
      const [prefix, limit, windowMs] = rule;
      const result = rateLimit(`${prefix}:${getClientIp(request)}`, limit, windowMs);
      if (!result.ok) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
        );
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const isAuthenticated = await isAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);

    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
