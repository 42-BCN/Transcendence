export const BASE_URL = process.env.BASE_URL ?? 'https://localhost:8443/api/';

export const TEST_EMAIL = process.env.AUTH_TEST_EMAIL ?? 'capapes@fakemail.com';
export const TEST_PASSWORD = process.env.AUTH_TEST_PASSWORD ?? 'Password123!';

export const LOCKOUT_EMAIL = process.env.AUTH_LOCKOUT_EMAIL ?? 'lockout.test@fakemail.com';
export const LOCKOUT_PASSWORD = process.env.AUTH_LOCKOUT_PASSWORD ?? 'LockoutTest123!';
export const LOCKOUT_WRONG_PASSWORD =
  process.env.AUTH_LOCKOUT_WRONG_PASSWORD ?? 'definitely-wrong-password';

export const TEST_SIGNUP_PASSWORD = process.env.AUTH_TEST_SIGNUP_PASSWORD ?? 'SmokeTest123!';

export const RUN_LOCKOUT = process.env.RUN_LOCKOUT === 'true';
export const RUN_GOOGLE = process.env.RUN_GOOGLE === 'true';
