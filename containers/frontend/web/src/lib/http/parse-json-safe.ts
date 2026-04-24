import { FALLBACK } from './fallback';

export async function parseJsonSafe<T>(text: string): Promise<T | null> {
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return FALLBACK.data as T;
  }
}
