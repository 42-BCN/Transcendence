import { NextResponse } from 'next/server';

import { envServer } from '@/lib/config/env.server';

function backendAuthUrl(path: string): string {
  return `${envServer.apiBaseUrl}${path}`;
}

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';

  const upstream = await fetch(backendAuthUrl('/auth/google'), {
    method: 'GET',
    headers: cookie ? { Cookie: cookie } : undefined,
    redirect: 'manual',
    cache: 'no-store',
  });

  const location = upstream.headers.get('location');
  if (!location) {
    return NextResponse.json(
      { ok: false, error: { code: 'AUTH_INTERNAL_ERROR' } },
      { status: 500 },
    );
  }

  const res = NextResponse.redirect(location, { status: upstream.status });
  const setCookie = upstream.headers.get('set-cookie');
  if (setCookie) res.headers.set('set-cookie', setCookie);

  return res;
}
