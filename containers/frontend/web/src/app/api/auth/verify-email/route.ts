import { NextResponse } from 'next/server';

import { appendSetCookies, proxyJsonWithSetCookie } from '@/lib/http/proxy.server';

export async function POST(req: Request) {
  const body = await req.json();

  const { status, data, setCookies } = await proxyJsonWithSetCookie({
    endpoint: '/auth/verify-email',
    method: 'POST',
    body,
  });

  const res = NextResponse.json(data, { status });

  appendSetCookies(res.headers, setCookies);

  return res;
}
