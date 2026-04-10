import { NextResponse } from 'next/server';

import { envServer } from '@/lib/config/env.server';

function backendAuthUrl(path: string): string {
  return `${envServer.apiBaseUrl}${path}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qs = url.searchParams.toString();
  const endpoint = `/auth/callback/google${qs ? `?${qs}` : ''}`;
  const cookie = req.headers.get('cookie') ?? '';

  const upstream = await fetch(backendAuthUrl(endpoint), {
    method: 'GET',
    headers: cookie ? { Cookie: cookie } : undefined,
    redirect: 'manual',
    cache: 'no-store',
  });

  const setCookie = upstream.headers.get('set-cookie');

  if (upstream.status >= 400) {
    const text = await upstream.text();
    let json: unknown = { ok: false, error: { code: 'AUTH_INTERNAL_ERROR' } };
    if (text) {
      try {
        json = JSON.parse(text) as unknown;
      } catch {
        json = { ok: false, error: { code: 'AUTH_INTERNAL_ERROR' } };
      }
    }
    const res = NextResponse.json(json, { status: upstream.status });
    if (setCookie) res.headers.set('set-cookie', setCookie);
    return res;
  }

  const location = upstream.headers.get('location') || '/profile';
  const safeLocation = location.startsWith('/') ? location : '/profile';
  const res = NextResponse.redirect(safeLocation, { status: upstream.status || 302 });
  if (setCookie) res.headers.set('set-cookie', setCookie);
  return res;
}
