import { NextResponse } from 'next/server';

import { proxyJsonWithSetCookie } from '@/lib/http/proxy.server';

export async function POST(req: Request) {
  const body = await req.json();

  const { status, data } = await proxyJsonWithSetCookie({
    endpoint: '/auth/reset-password',
    method: 'POST',
    body,
  });

  return NextResponse.json(data, { status });
}
