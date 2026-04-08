'use server';

import { cookies } from 'next/headers';

import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';
import type { ApiResponse } from '@/contracts/api/http';
import type { ResendVerificationRes } from '@/contracts/api/auth/auth.contract';

const PENDING_VERIFICATION_EMAIL_COOKIE = 'pending_verification_email';

export async function resendVerificationAction(): Promise<ApiResponse<unknown>> {
  const result = await withServerAction(async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    const email = cookieStore.get(PENDING_VERIFICATION_EMAIL_COOKIE)?.value;
    if (!email) {
      return { ok: false, error: { code: 'AUTH_NO_PENDING_VERIFICATION' } } as const;
    }

    const res = await fetchServer<ResendVerificationRes>(
      '/auth/resend-verification',
      'POST',
      { email },
      { cookie },
    );

    return res.data;
  })();

  return result;
}
