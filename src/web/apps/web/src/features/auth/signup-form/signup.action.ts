'use server';

import { fetchServer } from '@/lib/http/fetcher.server';

export async function signupAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const res = await fetchServer<{ ok: true }>('/auth/signup', 'POST', {
    email,
    password,
  });

  if (!res.ok) return;
}
