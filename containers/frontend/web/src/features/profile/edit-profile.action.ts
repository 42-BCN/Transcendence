'use server';

import { getLocale } from 'next-intl/server';

import type { UserMeProfileResponse } from '@/contracts/api/users/users.contracts';
import { redirect } from '@/i18n/navigation';
import { fetchServerAction } from '@/lib/http/fetcher.server';

export async function editProfileAction(_prevState: unknown, formData: FormData) {
  const bio = String(formData.get('bio') ?? '').trim();
  const locale = await getLocale();

  const result = await fetchServerAction<UserMeProfileResponse>('/protected/me/profile', 'PUT', {
    bio,
  });

  if (!result.ok) return result;

  redirect({ href: '/me', locale });
}
