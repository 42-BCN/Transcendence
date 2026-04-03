// This could be controlled by environment variables in a real application, but hardcoded for simplicity here.
// If you change these values, consider how they affect the seed users created in scripts/seed.ts

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const KB = 1024;

type AuthSecurityConfig = {
  maxFailedAttempts: number;
  lockoutDurationMs: number;
  argon2: {
    memoryCost: number;
    timeCost: number;
    parallelism: number;
    hashLength: number;
  };
};

export const authSecurityConfig: AuthSecurityConfig = {
  maxFailedAttempts: 5,
  lockoutDurationMs: 15 * MINUTE,
  argon2: {
    memoryCost: 64 * KB,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
  },
};
