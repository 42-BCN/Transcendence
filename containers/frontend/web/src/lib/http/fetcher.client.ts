import { jsonBody } from './utils';
import type { HttpMethod } from './utils';

// TODO check when merged to main fallback
export async function fetchClient<T>(
  endpoint: string,
  method: HttpMethod,
  data?: unknown,
  opts?: { withAuth?: boolean },
): Promise<{
  data: T;
  headers: Headers;
  status: number;
}> {
  const res = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: jsonBody(data),
    credentials: opts?.withAuth ? 'include' : 'omit',
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as T) : (null as T);

  return {
    data: json,
    headers: res.headers,
    status: res.status,
  };
}
