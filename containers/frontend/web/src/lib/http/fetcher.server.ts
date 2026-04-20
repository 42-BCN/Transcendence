import { jsonBody } from './utils';
import type { HttpMethod } from './utils';
import { envServer } from '../config/env.server';

const API_BASE_URL = envServer.apiBaseUrl;

function cookieHeaders(cookie?: string): Record<string, string> {
  return cookie ? { Cookie: cookie } : {};
}

const FALLBACK = {
  data: {
    ok: false,
    error: {
      code: 'FETCH_FAILED',
    },
  },
};

export function withServerAction<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  return async (...args: TArgs): Promise<TResult> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error(error);
      return FALLBACK as TResult;
    }
  };
}

export async function fetchServer<T>(
  endpoint: string,
  method: HttpMethod,
  data?: unknown,
  opts?: { cookie?: string; acceptLanguage?: string },
): Promise<{
  data: T;
  headers: Headers;
  status: number;
}> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(opts?.acceptLanguage ? { 'Accept-Language': opts.acceptLanguage } : {}),
      ...cookieHeaders(opts?.cookie),
    },
    body: jsonBody(data),
    cache: 'no-store',
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    return { data: json as T, headers: res.headers, status: res.status };
  }

  return { data: json as T, headers: res.headers, status: res.status };
}
