// This could be controlled by environment variables in a real application, but hardcoded for simplicity here.
// If you change these values, consider how they affect the seed users created in scripts/seed.ts

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const KB = 1024;

export const authSecurityConfig = {
  maxFailedAttempts: 3,
  lockoutDurationMs: 15 * MINUTE,
  resendVerificationCooldownMs: 60 * SECOND,
  rateLimit: {
    authIp: {
      max: 30,
      windowMs: MINUTE,
    },
    loginIp: {
      max: 20,
      windowMs: MINUTE,
    },
    loginIdentifier: {
      max: 20,
      windowMs: 10 * MINUTE,
    },
    emailFlow: {
      max: 3,
      windowMs: 15 * MINUTE,
    },
    tokenFlow: {
      max: 5,
      windowMs: 15 * MINUTE,
    },
    sessionFlow: {
      max: 60,
      windowMs: MINUTE,
    },
    guestSession: {
      max: 10,
      windowMs: MINUTE,
    },
  },
  argon2: {
    memoryCost: 64 * KB,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
  },
};
