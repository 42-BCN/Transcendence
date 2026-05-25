'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import type { DeleteMeRes } from '@/contracts/api/auth/auth.contract';
import { redirect } from '@/i18n/navigation';
import { fetchServerAction } from '@/lib/http/fetcher.server';

export async function deleteAccountAction(_prevState: unknown, _formData: FormData) {
  const result = await fetchServerAction<DeleteMeRes>('/protected/me', 'DELETE');

  if (!result.ok) return result;

  const locale = await getLocale();
  const cookieStore = await cookies();

  cookieStore.set('sid', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  redirect({ href: '/login', locale });
}
