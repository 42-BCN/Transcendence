'use server';

import { cookies } from 'next/headers';

import type { VerifyEmailRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';
import { VerifyEmailReqSchema } from '@/contracts/api/auth/auth.validation';
import { getValidationErrorResult } from '@/lib/http/errors';

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

export const verifyEmailAction = withServerAction(
  async (token: string): Promise<VerifyEmailRes> => {
    const parsedToken = VerifyEmailReqSchema.safeParse({ token });

    if (!parsedToken.success) return getValidationErrorResult(parsedToken.error);

    const { data, headers } = await fetchServer<VerifyEmailRes>('/auth/verify-email', 'POST', {
      token: parsedToken.data.token,
    });

    if (data.ok) await setAuthCookies(headers);

    return data;
  },
);
