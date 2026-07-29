import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, getAdminSessionToken } from '@/lib/auth';
import {
  MEMBER_SESSION_COOKIE,
  getMemberSessionToken,
} from '@/lib/portal/types';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAdmin = adminSession === getAdminSessionToken();

  const memberSession = request.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  const isMember = memberSession === getMemberSessionToken();

  // --- Admin ---
  if (pathname.startsWith('/admin') && !isAdmin) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && isAdmin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // --- Portal del socio ---
  const isPortalPublic =
    pathname === '/app/login' ||
    pathname === '/app/registro' ||
    pathname.startsWith('/app/registro/');

  if (pathname.startsWith('/app') && !isPortalPublic && !isMember) {
    const loginUrl = new URL('/app/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === '/app/login' || pathname === '/app/registro') && isMember) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/app', '/app/:path*'],
};
