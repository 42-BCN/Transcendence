'use server';

import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

import type { UserMeProfileResponse } from '@/contracts/api/users/users.contracts';
import { redirect } from '@/i18n/navigation';
import { fetchServerAction } from '@/lib/http/fetcher.server';

export async function editProfileAction(_prevState: unknown, formData: FormData) {
  const bio = String(formData.get('bio') ?? '').trim();
  const avatarValue = formData.get('avatar');
  const avatar = typeof avatarValue === 'string' && avatarValue.trim() !== '' ? avatarValue.trim() : null;
  const locale = await getLocale();

  const result = await fetchServerAction<UserMeProfileResponse>('/protected/me/profile', 'PUT', {
    bio,
    avatar,
  });

  if (!result.ok) return result;

  revalidatePath(`/${locale}`, 'layout');
  redirect({ href: '/me', locale });
}
