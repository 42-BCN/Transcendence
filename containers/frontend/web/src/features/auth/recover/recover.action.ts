'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { type RecoverRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

const RECOVER_IDENTIFIER_COOKIE = 'recover_identifier';
const TEN_MINUTES_S = 60 * 10;

export async function recoverAction(_prevState: unknown, formData: FormData) {
  const identifier = String(formData.get('identifier') ?? '');
  const result = await withServerAction(async () => {
    const res = await fetchServer<RecoverRes>('/auth/recover', 'POST', { identifier });

    return res.data;
  })();

  if (!result.ok) return result;

  const cookieStore = await cookies();
  cookieStore.set(RECOVER_IDENTIFIER_COOKIE, identifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TEN_MINUTES_S,
  });

  const locale = await getLocale();
  redirect({ href: '/recover/success', locale });
}
