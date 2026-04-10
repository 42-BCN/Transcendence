'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

import { type LoginRes } from '@/contracts/api/auth/auth.contract';

const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7;

function getAuthCookie(headers: Headers): string[] {
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie();

  const setCookie = headers.get('set-cookie');
  return setCookie ? [setCookie] : [];
}

async function setAuthCookies(headers: Headers) {
  const setCookies = getAuthCookie(headers);
  const cookieStore = await cookies();

  for (const sc of setCookies) {
    const [pair] = sc.split(';');
    const eq = pair.indexOf('=');
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

export async function loginAction(_prevState: unknown, formData: FormData) {
  const result = await withServerAction(async () => {
    const identifier = String(formData.get('identifier') ?? '');
    const password = String(formData.get('password') ?? '');

    const { data, headers } = await fetchServer<LoginRes>('/auth/login', 'POST', {
      identifier,
      password,
    });

    if (!data.ok) return data;

    await setAuthCookies(headers);
    return data;
  })();

  if (!result.ok) return result;

  const locale = await getLocale();
  redirect({ href: '/profile', locale });
}
