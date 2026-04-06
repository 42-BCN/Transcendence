import { BASE_URL } from './smoke.config';
import { cookieHeader, storeCookies } from './smoke.utils';

export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ res: Response; body: T | null; text: string }> {
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const cookies = cookieHeader();
  if (cookies) headers.set('Cookie', cookies);

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...init,
    headers,
    redirect: 'manual',
  });

  storeCookies(res);

  const text = await res.text();
  let body: T | null = null;

  if (text) {
    try {
      body = JSON.parse(text) as T;
    } catch {
      body = null;
    }
  }

  return { res, body, text };
}
