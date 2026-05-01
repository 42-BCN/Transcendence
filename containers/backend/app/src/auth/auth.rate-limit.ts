import type { RequestHandler } from 'express';

import { ApiError } from '@shared';
import {
  createRateLimit as createSharedRateLimit,
  type RateLimitOptions,
} from '@shared/rate-limit';

import { authSecurityConfig } from './security.config';

type AuthRateLimitOptions = Omit<RateLimitOptions, 'onLimitExceeded'>;

export const AUTH_RATE_LIMIT_KEYS = {
  authIp: 'rl:auth:ip',
  loginIp: 'rl:auth:login:ip',
  loginIdentifier: 'rl:auth:login:id',
  signupEmail: 'rl:auth:signup:email',
  resetEmail: 'rl:auth:reset:email',
  resetPasswordToken: 'rl:auth:reset-password:token',
  resendVerificationEmail: 'rl:auth:resend:verification:email',
  verifyEmailToken: 'rl:auth:verify-email:token',
  guestSessionIp: 'rl:auth:guest-session:ip',
  sessionIdentityIp: 'rl:auth:session-identity:ip',
} as const;

export function createRateLimit(options: AuthRateLimitOptions): RequestHandler {
  return createSharedRateLimit({
    ...options,
    onLimitExceeded: () => new ApiError('AUTH_RATE_LIMITED'),
  });
}

export const authIpRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.authIp,
  max: authSecurityConfig.rateLimit.authIp.max,
  windowMs: authSecurityConfig.rateLimit.authIp.windowMs,
  extractRaw: (req) => {
    const value = req.ip || req.socket.remoteAddress || 'unknown';
    return value.startsWith('::ffff:') ? value.slice(7) : value;
  },
});
