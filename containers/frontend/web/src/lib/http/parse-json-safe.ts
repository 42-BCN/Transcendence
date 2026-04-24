import { FALLBACK } from './fallback';

export function parseJsonSafe<T>(text: string): T | null {
  if (!text) return FALLBACK.data as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return FALLBACK.data as T;
  }
}
