export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function jsonBody(data?: unknown): string | undefined {
  return data === undefined ? undefined : JSON.stringify(data);
}
