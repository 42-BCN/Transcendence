'use server';

import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

export async function changePasswordAction(_prevState: unknown, formData: FormData) {
  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');

  const result = await withServerAction(async () => {
    const res = await fetchServer('/protected/me/reset-password', 'POST', {
      currentPassword,
      newPassword,
    });

    return res.data;
  })();

  return result;
}
