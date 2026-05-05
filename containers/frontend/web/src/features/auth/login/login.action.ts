'use server';

import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/navigation';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';
import { forwardAuthCookies } from '@/lib/http/auth-cookies.server';

import { type LoginRes } from '@/contracts/api/auth/auth.contract';

export async function loginAction(_prevState: unknown, formData: FormData) {
  const result = await withServerAction(async () => {
    const identifier = String(formData.get('identifier') ?? '');
    const password = String(formData.get('password') ?? '');

    const { data, headers } = await fetchServer<LoginRes>('/auth/login', 'POST', {
      identifier,
      password,
    });

    if (data.ok) await forwardAuthCookies(headers);
    return data;
  })();

  if (!result.ok) return result;

  const locale = await getLocale();

  revalidatePath(`/${locale}`, 'layout');
  redirect({ href: '/', locale });
}
