'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { fetchServerAction } from '@/lib/http/fetcher.server';
import type { ApiResponse } from '@/contracts/api/http';
import type { RecoverRes } from '@/contracts/api/auth/auth.contract';

const RECOVER_IDENTIFIER_COOKIE = 'recover_identifier';

export async function resendRecoverAction(): Promise<ApiResponse<unknown>> {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const identifier = cookieStore.get(RECOVER_IDENTIFIER_COOKIE)?.value;

  if (!identifier) {
    return { ok: false, error: { code: 'AUTH_NO_PENDING_RECOVER' } } as const;
  }

  const result = await fetchServerAction<RecoverRes>(
    '/auth/recover',
    'POST',
    { identifier },
    {
      acceptLanguage: locale,
    },
  );

  return result;
}
