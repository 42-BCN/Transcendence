import { jsonBody } from './utils';
import type { HttpMethod } from './utils';

const FALLBACK = {
  data: {
    ok: false,
    error: {
      code: 'FETCH_FAILED',
    },
  },
};

// TODO check const fallback merge conflict

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
  try {
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
  } catch (error) {
    return {
      data: FALLBACK.data as T,
      headers: new Headers(),
      status: 0,
    };
  }
}
