import { createHash } from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { getRedisClient } from './redis.client';

function fingerprint(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

async function incrementWithTtl(key: string, windowSec: number): Promise<number> {
  const redis = getRedisClient();
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowSec);
    return count;
  }

  const ttl = await redis.ttl(key);
  if (ttl < 0) {
    await redis.expire(key, windowSec);
  }

  return count;
}

export type RateLimitOptions = {
  keyPrefix: string;
  max: number;
  windowMs: number;
  extractRaw: (req: Request) => string | undefined;
  normalize?: (value: string) => string;
  onLimitExceeded?: () => unknown;
  onInternalError?: (error: unknown) => void;
};

export function createRateLimit(options: RateLimitOptions): RequestHandler {
  const { keyPrefix, max, windowMs, extractRaw, normalize, onLimitExceeded, onInternalError } =
    options;

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = extractRaw(req);
      if (!raw) return next();

      const normalized = normalize ? normalize(raw) : raw;
      const key = `${keyPrefix}:${fingerprint(normalized)}`;
      const windowSec = Math.ceil(windowMs / 1000);
      const count = await incrementWithTtl(key, windowSec);

      if (count > max) {
        return next(onLimitExceeded ? onLimitExceeded() : new Error('RATE_LIMIT_EXCEEDED'));
      }

      return next();
    } catch (error) {
      if (onInternalError) onInternalError(error);
      else console.error('Rate limiter unavailable, allowing request', error);
      return next();
    }
  };
}
