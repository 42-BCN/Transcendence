import { FetcherError } from './errors';
import { jsonBody } from './utils';
import type { HttpMethod } from './utils';

export async function fetchClient<T>(
  endpoint: string,
  method: HttpMethod,
  data?: unknown,
  opts?: { withAuth?: boolean },
): Promise<T> {
  const res = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: jsonBody(data),
    credentials: opts?.withAuth ? 'include' : 'omit',
  });

  const json = await res.json();
  if (!res.ok) throw new FetcherError(res.status, json);

  return json as T;
}
