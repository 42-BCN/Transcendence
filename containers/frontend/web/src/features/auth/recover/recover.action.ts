'use server';

import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { type RecoverRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

export async function recoverAction(_prevState: unknown, formData: FormData) {
  const result = await withServerAction(async () => {
    const identifier = String(formData.get('identifier') ?? '');
    const res = await fetchServer<RecoverRes>('/auth/recover', 'POST', { identifier });

    return res.data;
  })();

  if (!result.ok) return result;

  const locale = await getLocale();
  redirect({ href: '/recover/success', locale });
}
