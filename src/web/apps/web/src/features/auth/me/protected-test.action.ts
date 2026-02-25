'use server';

import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function protectedMeAction() {
  const cookie = (await cookies()).toString();
  console.log(cookie);
  try {
    const body = await fetchServer('/protected/me', 'GET', undefined, { cookie });
    console.log(body);
    return { ok: true, body };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Unknown error' };
  }
}
