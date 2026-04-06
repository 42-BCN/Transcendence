import { createHash } from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { ApiError, getRedisClient } from '@shared';

import { authSecurityConfig } from './auth.security.config';

const KEYS = {
  loginIp: 'rl:auth:login:ip',
  loginIdentifier: 'rl:auth:login:id',
  resetEmail: 'rl:auth:reset:email',
  resendVerificationEmail: 'rl:auth:resend:verification:email',
} as const;

function fingerprint(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

function getClientIp(req: Request): string {
  const value = req.ip || req.socket.remoteAddress || 'unknown';
  return value.startsWith('::ffff:') ? value.slice(7) : value;
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

type HashedLimiterOptions = {
  keyPrefix: string;
  max: number;
  windowMs: number;
  extractRaw: (req: Request) => string | undefined;
  normalize?: (value: string) => string;
};

function createHashedLimiter(options: HashedLimiterOptions): RequestHandler {
  const { keyPrefix, max, windowMs, extractRaw, normalize } = options;

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = extractRaw(req);
      if (!raw) return next();

      const normalized = normalize ? normalize(raw) : raw;
      const key = `${keyPrefix}:${fingerprint(normalized)}`;
      const windowSec = Math.ceil(windowMs / 1000);
      const count = await incrementWithTtl(key, windowSec);

      if (count > max) throw new ApiError('AUTH_RATE_LIMITED');
      return next();
    } catch (error) {
      if (error instanceof ApiError) return next(error);

      console.error('Rate limiter unavailable, allowing request', error);
      return next();
    }
  };
}

export const loginIpRateLimit = createHashedLimiter({
  keyPrefix: KEYS.loginIp,
  max: authSecurityConfig.rateLimit.loginIp.max,
  windowMs: authSecurityConfig.rateLimit.loginIp.windowMs,
  extractRaw: getClientIp,
});

export const loginIdentifierRateLimit = createHashedLimiter({
  keyPrefix: KEYS.loginIdentifier,
  max: authSecurityConfig.rateLimit.loginIdentifier.max,
  windowMs: authSecurityConfig.rateLimit.loginIdentifier.windowMs,
  extractRaw: (req) => {
    const identifier = req.body?.identifier;
    return typeof identifier === 'string' ? identifier : undefined;
  },
});

export function createEmailFlowRateLimit(
  extractEmail: (req: Request) => string | undefined,
  keyPrefix: string = KEYS.resetEmail,
): RequestHandler {
  return createHashedLimiter({
    keyPrefix,
    max: authSecurityConfig.rateLimit.emailFlow.max,
    windowMs: authSecurityConfig.rateLimit.emailFlow.windowMs,
    extractRaw: extractEmail,
  });
}

export const signupEmailRateLimit = createEmailFlowRateLimit((req) => {
  const email = req.body?.email;
  return typeof email === 'string' ? email : undefined;
});

export const resendVerificationEmailRateLimit = createEmailFlowRateLimit((req) => {
  const email = req.body?.email;
  return typeof email === 'string' ? email : undefined;
}, KEYS.resendVerificationEmail);
