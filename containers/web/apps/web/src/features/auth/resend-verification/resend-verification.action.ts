'use server';

import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';
import { type ApiResponse } from '@/contracts/http';

export async function resendVerificationAction(): Promise<ApiResponse<unknown>> {
  // TODO: For now, the endpoint is a placeholder until the backend implements it.
  // But we've prepared it following the project pattern.
  try {
    const cookie = (await cookies()).toString();
    const { data } = await fetchServer<ApiResponse<unknown>>(
      '/auth/resend-verification',
      'POST',
      {},
      { cookie },
    );
    return data;
  } catch {
    return { ok: false, error: { code: 'FAILED_TO_RESEND' } };
  }
}
