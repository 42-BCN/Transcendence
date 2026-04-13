'use server';

import type { ResetPasswordRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

export async function resetPasswordAction(_prevState: unknown, formData: FormData) {
  const token = String(formData.get('token') ?? '');
  const password = String(formData.get('password') ?? '');

  const result = await withServerAction(async () => {
    const res = await fetchServer<ResetPasswordRes>('/auth/reset-password', 'POST', {
      token,
      password,
    });

    return res.data;
  })();

  return result;
}
