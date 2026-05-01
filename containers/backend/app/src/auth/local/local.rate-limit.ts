import { authSecurityConfig } from '../security.config';
import { AUTH_RATE_LIMIT_KEYS, createRateLimit } from '../auth.rate-limit';

export const localSignupEmailRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.signupEmail,
  max: authSecurityConfig.rateLimit.emailFlow.max,
  windowMs: authSecurityConfig.rateLimit.emailFlow.windowMs,
  extractRaw: (req) => {
    const email = req.body?.email;
    return typeof email === 'string' ? email : undefined;
  },
});

export const localLoginIdentifierRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.loginIdentifier,
  max: authSecurityConfig.rateLimit.loginIdentifier.max,
  windowMs: authSecurityConfig.rateLimit.loginIdentifier.windowMs,
  extractRaw: (req) => {
    const identifier = req.body?.identifier;
    return typeof identifier === 'string' ? identifier : undefined;
  },
});

export const localLoginIpRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.loginIp,
  max: authSecurityConfig.rateLimit.loginIp.max,
  windowMs: authSecurityConfig.rateLimit.loginIp.windowMs,
  extractRaw: (req) => {
    const value = req.ip || req.socket.remoteAddress || 'unknown';
    return value.startsWith('::ffff:') ? value.slice(7) : value;
  },
});

export const guestSessionRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.guestSessionIp,
  max: authSecurityConfig.rateLimit.guestSession.max,
  windowMs: authSecurityConfig.rateLimit.guestSession.windowMs,
  extractRaw: (req) => req.ip,
});

export const sessionIdentityRateLimit = createRateLimit({
  keyPrefix: AUTH_RATE_LIMIT_KEYS.sessionIdentityIp,
  max: authSecurityConfig.rateLimit.sessionFlow.max,
  windowMs: authSecurityConfig.rateLimit.sessionFlow.windowMs,
  extractRaw: (req) => req.ip,
});
