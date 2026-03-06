'use server';

import type { SignupRes } from '@/contracts/auth/auth.contract';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function signupAction(_prevState: unknown, formData: FormData) {
  const email = String(formData?.get('email') ?? '');
  const password = String(formData?.get('password') ?? '');

  const res = await fetchServer<SignupRes>('/auth/signup', 'POST', {
    email,
    password,
  });

  if (!res.data.ok) return { ok: false, res };
  return { ok: true, res };
}
