'use server';

import type { SignupRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer } from '@/lib/http/fetcher.server';
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export async function createAccountAction(_prevState: unknown, formData: FormData) {
  const email = String(formData?.get('email') ?? '');
  const password = String(formData?.get('password') ?? '');
  const privacy = formData?.get('privacy') === 'on';

  const res = await fetchServer<SignupRes>('/auth/signup', 'POST', {
    email,
    password,
    privacy,
  });

  if (!res.data.ok) return { ok: false, res };
  const locale = await getLocale();
  redirect({ href: '/create-account/success', locale });
}
