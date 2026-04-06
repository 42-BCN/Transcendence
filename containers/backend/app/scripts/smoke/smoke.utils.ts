/* eslint-disable no-console */

import type { TestResult } from './smoke.types';

let cookieJar = new Map<string, string>();

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function uniqueEmail(prefix: string): string {
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}_${stamp}@example.com`;
}

function parseSetCookie(setCookie: string): { name: string; value: string } | null {
  const firstPart = setCookie.split(';')[0];
  const eqIndex = firstPart.indexOf('=');

  if (eqIndex <= 0) return null;

  return {
    name: firstPart.slice(0, eqIndex).trim(),
    value: firstPart.slice(eqIndex + 1).trim(),
  };
}

export function storeCookies(res: Response): void {
  const headers = res.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookies =
    typeof headers.getSetCookie === 'function'
      ? headers.getSetCookie()
      : ([res.headers.get('set-cookie')].filter(Boolean) as string[]);

  for (const raw of setCookies) {
    const parsed = parseSetCookie(raw);
    if (!parsed) continue;

    if (parsed.value === '') {
      cookieJar.delete(parsed.name);
      continue;
    }

    cookieJar.set(parsed.name, parsed.value);
  }
}

export function cookieHeader(): string | undefined {
  if (cookieJar.size === 0) return undefined;

  return Array.from(cookieJar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

export function hasCookie(name: string): boolean {
  return cookieJar.has(name);
}

export function clearCookies(): void {
  cookieJar = new Map();
}

export function logStep(title: string): void {
  console.log(`\n=== ${title} ===`);
}

export function logResponse(res: Response, body: unknown, text: string): void {
  console.log('status:', res.status);
  // console.log("location:", res.headers.get("location"));
  // console.log("cookies:", cookieHeader() ?? "(none)");
  console.log('body:', body ? JSON.stringify(body, null, 2) : text || '(empty)');
}

export async function runTest(
  results: TestResult[],
  name: string,
  fn: () => Promise<void>,
): Promise<void> {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`✔ ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, ok: false, message });
    console.error(`✘ ${name}`);
    console.error(message);
  }
}

export function printSummary(results: TestResult[]): void {
  const passed = results.filter((result) => result.ok).length;
  const failed = results.length - passed;

  console.log('\n====================');
  console.log('SMOKE TEST SUMMARY');
  console.log('====================');

  for (const result of results) {
    if (result.ok) {
      console.log(`✔ ${result.name}`);
    } else {
      console.log(`✘ ${result.name} — ${result.message}`);
    }
  }

  console.log('\n--------------------');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${results.length}`);
  console.log('--------------------');
}
