import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  getAdminCredentials,
  getAdminSessionToken,
} from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const credentials = getAdminCredentials();

  if (
    email !== credentials.email.toLowerCase() ||
    password !== credentials.password
  ) {
    return NextResponse.json(
      { ok: false, error: 'Correo o contraseña incorrectos.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
