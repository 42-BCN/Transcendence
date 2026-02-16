// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { proxyJsonWithSetCookie } from '@/lib/http/proxy.server';

export async function POST(req: Request) {
  const body = await req.json();

  const { status, data, setCookie } = await proxyJsonWithSetCookie({
    endpoint: '/auth/login',
    method: 'POST',
    body,
  });

  const res = NextResponse.json(data, { status });

  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
  }

  return res;
}
