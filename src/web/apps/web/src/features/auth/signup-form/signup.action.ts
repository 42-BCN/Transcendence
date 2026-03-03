'use server';

import type { AuthSignupResponse } from '@/contracts/auth/auth.contract';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function signupAction(_prevState: unknown, formData: FormData) {
  const email = String(formData?.get('email') ?? '');
  const password = String(formData?.get('password') ?? '');

  const res = await fetchServer<AuthSignupResponse>('/auth/signup', 'POST', {
    email,
    password,
  });
  console.log(res);
  if (!res.data.ok) return { ok: false, res };
  return { ok: true, res };
}
