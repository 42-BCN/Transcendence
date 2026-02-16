import type { HttpMethod } from './utils';

const API_BASE_URL = process.env.API_BASE_URL ?? '';
// Throwing on missing API_BASE_URL at module evaluation time can
// break next build / server startup in environments where
// the variable isn’t set yet (or for routes that don’t use this helper).
// Consider validating inside the exported function (fail fast when invoked)
// or providing a clearer env wiring for build/runtime.
if (!API_BASE_URL) throw new Error('Missing API_BASE_URL');

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
