'use server';

import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';
import { type ApiResponse } from '@/contracts/http';

export async function resendVerificationAction() {
  // TODO: De momento el endpoint es un placeholder hasta que el backend lo implemente.
  // Pero lo dejamos preparado siguiendo el patrón del proyecto.
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
    return { ok: false, error: 'FAILED_TO_RESEND' };
  }
}
