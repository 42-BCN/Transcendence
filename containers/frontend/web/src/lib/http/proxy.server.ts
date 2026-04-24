import type { HttpMethod } from './utils';
import { envServer } from '../config/env.server';
import { parseJsonSafe } from './parse-json-safe';

const API_BASE_URL = envServer.apiBaseUrl;

type HeadersWithSetCookie = Headers & {
  getSetCookie?: () => string[];
};

export async function proxyJsonWithSetCookie(args: {
  endpoint: string;
  method: HttpMethod;
  body: unknown;
}): Promise<{ status: number; data: unknown; setCookie: string | string[] | null }> {
  const res = await fetch(`${API_BASE_URL}${args.endpoint}`, {
    method: args.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(args.body),
    cache: 'no-store',
  });

  const text = await res.text();
  const data = await parseJsonSafe(text);

  const headers = res.headers as HeadersWithSetCookie;
  const setCookie = headers.getSetCookie?.() ?? headers.get('set-cookie');

  return { status: res.status, data, setCookie };
}
