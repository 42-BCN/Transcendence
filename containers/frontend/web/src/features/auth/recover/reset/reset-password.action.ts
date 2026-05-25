'use server';

import { getLocale } from 'next-intl/server';

import type { ResetPasswordRes } from '@/contracts/api/auth/auth.contract';
import { fetchServerAction } from '@/lib/http/fetcher.server';
import { redirect } from '@/i18n/navigation';

export async function resetPasswordAction(_prevState: unknown, formData: FormData) {
  const token = String(formData.get('token') ?? '');
  const password = String(formData.get('password') ?? '');
  const locale = await getLocale();

  const result = await fetchServerAction<ResetPasswordRes>('/auth/reset-password', 'POST', {
    token,
    password,
  });

  if (result.ok) {
    redirect({ href: '/login', locale });
  }

  return result;
}
