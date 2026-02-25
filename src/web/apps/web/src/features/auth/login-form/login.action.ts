'use server';

import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';
import { AuthLoginRequestSchema } from '@/contracts/auth/auth.validation';
import { type AuthLoginResponse } from '@/contracts/auth/auth.contract';

const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7;

function parseInput(formData: FormData) {
  const result = AuthLoginRequestSchema.safeParse({
    identifier: formData.get('identifier'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return {
      ok: false,
      errors: result.error.flatten(),
    };
  }

  return { ok: true, data: result.data };
}

function getAuthCookie(headers: any): string[] {
  if (typeof headers?.getSetCookie === 'function') return headers.getSetCookie();

  return headers.get('set-cookie') ? [headers.get('set-cookie')!] : [];
}

async function setAuthCookies(headers: any) {
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

export async function loginAction(formData: FormData) {
  const result = parseInput(formData);
  if (!result.ok) {
    return;
  }

  const { data, headers } = await fetchServer<AuthLoginResponse>(
    '/auth/login',
    'POST',
    result.data,
  );

  if (!data.ok) return;
  await setAuthCookies(headers);
}
