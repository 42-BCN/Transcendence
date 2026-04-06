'use server';

import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { fetchServer } from '@/lib/http/fetcher.server';
import { RecoverReqSchema, type RecoverRes } from '@/contracts/api/auth/auth.recover.caro';

function parseInput(formData: FormData) {
  const result = RecoverReqSchema.safeParse({
    identifier: formData.get('identifier'),
  });

  if (!result.success) {
    return {
      ok: false,
      errors: result.error.flatten(),
    };
  }

  return { ok: true, data: result.data };
}

// TODO Endpoint WIP
export async function recoverAction(formData: FormData) {
  const result = parseInput(formData);
  if (!result.ok) return;

  const res = await fetchServer<RecoverRes>('/auth/recover', 'POST', result.data);

  if (!res.data.ok) return res.data;

  const locale = await getLocale();
  redirect({ href: '/recover/success', locale });

  return;
}
