import type { RequestHandler } from 'express';

import { ApiError } from '@shared';
import {
  createRateLimit as createSharedRateLimit,
  type RateLimitOptions,
} from '@shared/rate-limit';

type AuthRateLimitOptions = Omit<RateLimitOptions, 'onLimitExceeded'>;

export const AUTH_RATE_LIMIT_KEYS = {
  loginIp: 'rl:auth:login:ip',
  loginIdentifier: 'rl:auth:login:id',
  signupEmail: 'rl:auth:signup:email',
  resetEmail: 'rl:auth:reset:email',
  resendVerificationEmail: 'rl:auth:resend:verification:email',
} as const;

export function createRateLimit(options: AuthRateLimitOptions): RequestHandler {
  return createSharedRateLimit({
    ...options,
    onLimitExceeded: () => new ApiError('AUTH_RATE_LIMITED'),
  });
}
