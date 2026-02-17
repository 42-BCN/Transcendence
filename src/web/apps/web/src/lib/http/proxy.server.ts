import type { HttpMethod } from './utils';
import { envServer } from '../env.server';

const API_BASE_URL = envServer.apiBaseUrl;

export async function proxyJsonWithSetCookie(args: {
  endpoint: string;
  method: HttpMethod;
  body: unknown;
}): Promise<{ status: number; data: unknown; setCookie: string | null }> {
  const res = await fetch(`${API_BASE_URL}${args.endpoint}`, {
    method: args.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(args.body),
    cache: 'no-store',
  });

  const data = await res.json();
  const setCookie = res.headers.get('set-cookie');

  return { status: res.status, data, setCookie };
}
