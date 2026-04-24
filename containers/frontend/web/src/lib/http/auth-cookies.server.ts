'use server';

import { cookies } from 'next/headers';

const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7;

function getSetCookieHeaders(headers: Headers): string[] {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }

  const setCookie = headers.get('set-cookie');
  return setCookie ? [setCookie] : [];
}

export async function forwardAuthCookies(headers: Headers): Promise<void> {
  const cookieStore = await cookies();
  const setCookies = getSetCookieHeaders(headers);

  for (const setCookie of setCookies) {
    const [pair] = setCookie.split(';');
    const eq = pair.indexOf('=');

    if (eq === -1) continue;

    const name = pair.slice(0, eq);
    const value = pair.slice(eq + 1);

    cookieStore.set(name, decodeURIComponent(value), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_S,
    });
  }
}
