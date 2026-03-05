import { fetchClient } from '@/lib/http/fetcher.client';
// import { fetchServer } from '@/lib/http/fetcher.server';

export async function oauthAction(_formData: FormData) {
  await fetchClient<unknown>('/api/auth/google', 'GET');
}
