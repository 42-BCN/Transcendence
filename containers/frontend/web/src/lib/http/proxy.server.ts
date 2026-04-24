import type { HttpMethod } from './utils';
import { envServer } from '../config/env.server';
import { parseJsonSafe } from './parse-json-safe';

const API_BASE_URL = envServer.apiBaseUrl;

type HeadersWithSetCookie = Headers & {
  getSetCookie?: () => string[];
};

function getSetCookies(headers: Headers): string[] {
  const headersWithSetCookie = headers as HeadersWithSetCookie;

  const setCookies = headersWithSetCookie.getSetCookie?.();

  if (setCookies?.length) {
    return setCookies;
  }

  const setCookie = headers.get('set-cookie');

  return setCookie ? [setCookie] : [];
}

export function appendSetCookies(headers: Headers, setCookies: string[]) {
  for (const setCookie of setCookies) {
    headers.append('set-cookie', setCookie);
  }
}

export async function proxyJsonWithSetCookie(args: {
  endpoint: string;
  method: HttpMethod;
  body: unknown;
}): Promise<{ status: number; data: unknown; setCookies: string[] }> {
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
  const data = parseJsonSafe(text);

  return {
    status: res.status,
    data,
    setCookies: getSetCookies(res.headers),
  };
}
