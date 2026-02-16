// lib/http/fetcher.server.ts
import { FetcherError } from './errors';
import { jsonBody } from './utils';
import type { HttpMethod } from './utils';
import { envServer } from '../env.server';

const API_BASE_URL = envServer.apiBaseUrl ?? '';
if (!API_BASE_URL) {
  throw new Error('Missing API_BASE_URL (server env)');
}

function cookieHeaders(cookie?: string): Record<string, string> {
  return cookie ? { Cookie: cookie } : {};
}

export async function fetchServer<T>(
  endpoint: string,
  method: HttpMethod,
  data?: unknown,
  opts?: { cookie?: string },
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...cookieHeaders(opts?.cookie),
    },
    body: jsonBody(data),
    cache: 'no-store',
  });

  const json = await res.json();

  if (!res.ok) {
    throw new FetcherError(res.status, json);
  }

  return json as T;
}
