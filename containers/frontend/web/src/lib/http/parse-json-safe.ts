import { FALLBACK } from './fallback';

export function parseJsonSafe<T>(text: string): T | null {
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return FALLBACK.data as T;
  }
}
