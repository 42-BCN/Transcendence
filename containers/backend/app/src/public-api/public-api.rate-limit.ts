import type { Request } from 'express';

import { ApiError, readApiKey } from '@shared';
import { createRateLimit } from '@shared/rate-limit';
import { extractRateLimitIp } from '../auth/auth.rate-limit';

const PUBLIC_API_RATE_LIMIT_KEYS = {
  requests: 'rl:public-api:requests',
  search: 'rl:public-api:search',
} as const;

function getPublicApiClientFingerprint(req: Request): string | undefined {
  const apiKey = readApiKey(req);
  if (!apiKey) return undefined;

  return `${apiKey}:${extractRateLimitIp(req)}`;
}

function readPositiveNumber(raw: string | undefined, fallback: number): number {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const publicApiRateLimit = createRateLimit({
  keyPrefix: PUBLIC_API_RATE_LIMIT_KEYS.requests,
  max: readPositiveNumber(process.env.PUBLIC_API_RATE_LIMIT_MAX, 120),
  windowMs: readPositiveNumber(process.env.PUBLIC_API_RATE_LIMIT_WINDOW_MS, 60_000),
  extractRaw: getPublicApiClientFingerprint,
  onLimitExceeded: () => new ApiError('AUTH_RATE_LIMITED'),
});

export const publicApiSearchRateLimit = createRateLimit({
  keyPrefix: PUBLIC_API_RATE_LIMIT_KEYS.search,
  max: readPositiveNumber(process.env.PUBLIC_API_SEARCH_RATE_LIMIT_MAX, 30),
  windowMs: readPositiveNumber(process.env.PUBLIC_API_SEARCH_RATE_LIMIT_WINDOW_MS, 60_000),
  extractRaw: getPublicApiClientFingerprint,
  onLimitExceeded: () => new ApiError('AUTH_RATE_LIMITED'),
});
