'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { fetchServerAction } from '@/lib/http/fetcher.server';
import type { ApiResponse } from '@/contracts/api/http';
import type { ResendVerificationRes } from '@/contracts/api/auth/auth.contract';

const PENDING_VERIFICATION_EMAIL_COOKIE = 'pending_verification_email';

export async function resendVerificationAction(
  _prevState?: unknown,
  formData?: FormData,
): Promise<ApiResponse<unknown>> {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const formEmail = String(formData?.get('email') ?? '').trim();
  const pendingEmail = formEmail || cookieStore.get(PENDING_VERIFICATION_EMAIL_COOKIE)?.value;
  if (!pendingEmail) {
    return { ok: true, data: null } as const;
  }

  const result = await fetchServerAction<ResendVerificationRes>(
    '/auth/resend-verification',
    'POST',
    {
      email: pendingEmail,
    },
    {
      acceptLanguage: locale,
    },
  );

  return result;
}
