'use server';

import type { MeRes } from '@/contracts/api/auth/auth.contract';
import { fetchServerAction } from '@/lib/http/fetcher.server';

export async function protectedMeAction() {
  return fetchServerAction<MeRes>('/protected/me', 'GET');
}
