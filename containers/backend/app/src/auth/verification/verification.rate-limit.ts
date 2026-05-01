import { authSecurityConfig } from '../security.config';
import { AUTH_RATE_LIMIT_KEYS, createRateLimit } from '../auth.rate-limit';

export const verificationResendEmailRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.resendVerificationEmail,
  max: authSecurityConfig.rateLimit.emailFlow.max,
  windowMs: authSecurityConfig.rateLimit.emailFlow.windowMs,
  extractRaw: (req) => {
    const email = req.body?.email;
    return typeof email === 'string' ? email : undefined;
  },
});

export const verifyEmailRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.verifyEmailToken,
  max: authSecurityConfig.rateLimit.tokenFlow.max,
  windowMs: authSecurityConfig.rateLimit.tokenFlow.windowMs,
  extractRaw: (req) => req.body?.token,
});
