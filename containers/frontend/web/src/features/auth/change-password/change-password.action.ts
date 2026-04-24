'use server';

import { cookies } from 'next/headers';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';
import { ChangePasswordRes } from '@/contracts/api/auth/auth.contract';

export async function changePasswordAction(_prevState: unknown, formData: FormData) {
  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const cookie = (await cookies()).toString();

  const result = await withServerAction(async () => {
    const res = await fetchServer<ChangePasswordRes>(
      '/protected/me/reset-password',
      'POST',
      {
        currentPassword,
        newPassword,
      },
      {
        cookie,
      },
    );

    return res.data;
  })();

  return result;
}
