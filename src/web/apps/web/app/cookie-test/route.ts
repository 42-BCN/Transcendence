import { NextResponse } from 'next/server';

export function GET() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set('nginx_test', 'works', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}
