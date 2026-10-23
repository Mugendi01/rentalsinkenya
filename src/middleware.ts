import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'rentals_kenya_secure_fallback_secret_key_2026';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'rentals_admin_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only check paths under /admin
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get(COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, secretKey);
        isAuthenticated = true;
      } catch (err) {
        isAuthenticated = false;
      }
    }

    // If trying to access admin dashboard while not authenticated -> redirect to login
    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If already authenticated and trying to visit login -> redirect to /admin
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
