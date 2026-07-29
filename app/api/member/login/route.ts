import { NextResponse } from 'next/server';
import {
  MEMBER_SESSION_COOKIE,
  getMemberDemoCredentials,
  getMemberSessionToken,
} from '@/lib/portal/types';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const credentials = getMemberDemoCredentials();

  const isDemoLogin =
    email === credentials.email.toLowerCase() && password === credentials.password;
  const isProposalLogin = email.includes('@') && password.length >= 6;

  if (!isDemoLogin && !isProposalLogin) {
    return NextResponse.json(
      { ok: false, error: 'Correo o contraseña incorrectos.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    email,
    name: body.name || email.split('@')[0],
  });

  response.cookies.set(MEMBER_SESSION_COOKIE, getMemberSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
