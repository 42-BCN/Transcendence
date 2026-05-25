'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';

import type { SignupRes } from '@/contracts/api/auth/auth.contract';
import { fetchServerAction } from '@/lib/http/fetcher.server';

const SIGNUP_SUCCESS_COOKIE = 'signup_success';
const PENDING_VERIFICATION_EMAIL_COOKIE = 'pending_verification_email';
const TEN_MINUTES_S = 60 * 10;

export async function createAccountAction(_prevState: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const locale = await getLocale();
  const result = await fetchServerAction<SignupRes>(
    '/auth/signup',
    'POST',
    {
      email,
      password,
    },
    { acceptLanguage: locale },
  );

  if (!result.ok) return result;

  const cookieStore = await cookies();

  cookieStore.set(SIGNUP_SUCCESS_COOKIE, '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TEN_MINUTES_S,
  });

  cookieStore.set(PENDING_VERIFICATION_EMAIL_COOKIE, email, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TEN_MINUTES_S,
  });

  redirect({ href: '/create-account/success', locale });
}
