'use server';

import { fetchServerAction } from '@/lib/http/fetcher.server';
import type { ChangePasswordRes } from '@/contracts/api/auth/auth.contract';

export async function changePasswordAction(_prevState: unknown, formData: FormData) {
  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');

  return fetchServerAction<ChangePasswordRes>('/protected/me/reset-password', 'POST', {
    currentPassword,
    newPassword,
  });
}
