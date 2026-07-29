import { NextResponse } from 'next/server';
import { MEMBER_SESSION_COOKIE } from '@/lib/portal/types';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(MEMBER_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
