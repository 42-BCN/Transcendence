'use server';

import { jsonBody } from './utils';
import type { HttpMethod } from './utils';
import { envServer } from '../config/env.server';

const API_BASE_URL = envServer.apiBaseUrl;

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

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    return;
  }

  return { data: json as T, headers: res.headers, status: res.status };
}
