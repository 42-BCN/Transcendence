'use server';

import { cookies } from 'next/headers';

import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';
import type { ApiResponse } from '@/contracts/api/http';
import type { ResendVerificationRes } from '@/contracts/api/auth/auth.contract';

const PENDING_VERIFICATION_EMAIL_COOKIE = 'pending_verification_email';

export async function resendVerificationAction(
  _prevState?: unknown,
  formData?: FormData,
): Promise<ApiResponse<unknown>> {
  const result = await withServerAction(async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    const formEmail = String(formData?.get('email') ?? '').trim();
    const pendingEmail = formEmail || cookieStore.get(PENDING_VERIFICATION_EMAIL_COOKIE)?.value;
    if (!pendingEmail) {
      return { ok: true, data: null } as const;
    }

    const res = await fetchServer<ResendVerificationRes>(
      '/auth/resend-verification',
      'POST',
      { email: pendingEmail },
      { cookie },
    );

    return res.data;
  })();

  return result;
}
