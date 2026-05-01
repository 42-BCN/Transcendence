import { authSecurityConfig } from '../security.config';
import { AUTH_RATE_LIMIT_KEYS, createRateLimit } from '../auth.rate-limit';

export const recoveryRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.resetEmail,
  max: authSecurityConfig.rateLimit.emailFlow.max,
  windowMs: authSecurityConfig.rateLimit.emailFlow.windowMs,
  extractRaw: (req) => {
    const identifier = req.body?.identifier;
    return typeof identifier === 'string' ? identifier : undefined;
  },
});

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export const resetPasswordRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.resetPasswordToken,
  max: 5,
  windowMs: FIFTEEN_MINUTES_MS,
  extractRaw: (req) => req.body?.token,
});
