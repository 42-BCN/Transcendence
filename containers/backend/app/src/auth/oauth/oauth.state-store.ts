import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import type { Request, Response, CookieOptions } from 'express';

const STATE_COOKIE_NAME = 'google_oauth_state';
const STATE_COOKIE_PATH = '/api/auth/callback/google';
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

type VerifyFailure = { message: string };

function stateCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: STATE_COOKIE_PATH,
    maxAge: STATE_MAX_AGE_MS,
  };
}

function clearStateCookie(res: Response | undefined): void {
  if (!res) return;
  res.clearCookie(STATE_COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: STATE_COOKIE_PATH,
  });
}

function parseCookieHeader(header: string | undefined): Record<string, string> {
  if (!header) return {};

  return header.split(';').reduce<Record<string, string>>((cookies, chunk) => {
    const trimmed = chunk.trim();
    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) return cookies;

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);

    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }

    return cookies;
  }, {});
}

function sign(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export class GoogleOauthStateStore {
  constructor(private readonly secret: string) {}

  store(req: Request, callback: (err: Error | null, state?: string) => void): void {
    const res = req.res;

    if (!res) {
      callback(new Error('OAuth response object is not available.'));
      return;
    }

    const state = randomBytes(24).toString('hex');
    const expiresAt = Date.now() + STATE_MAX_AGE_MS;
    const payload = `${state}.${expiresAt}`;
    const signature = sign(this.secret, payload);

    res.cookie(STATE_COOKIE_NAME, `${payload}.${signature}`, stateCookieOptions());
    callback(null, state);
  }

  verify(
    req: Request,
    providedState: string,
    callback: (err: Error | null, ok?: boolean, info?: VerifyFailure) => void,
  ): void {
    const cookies = parseCookieHeader(req.headers.cookie);
    const rawCookie = cookies[STATE_COOKIE_NAME];

    clearStateCookie(req.res);

    if (!rawCookie) {
      callback(null, false, { message: 'Missing authorization request state cookie.' });
      return;
    }

    const parts = rawCookie.split('.');

    if (parts.length !== 3) {
      callback(null, false, { message: 'Malformed authorization request state cookie.' });
      return;
    }

    const [expectedState, expiresAtRaw, providedSignature] = parts;
    const payload = `${expectedState}.${expiresAtRaw}`;
    const expectedSignature = sign(this.secret, payload);
    const expiresAt = Number(expiresAtRaw);

    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      callback(null, false, { message: 'Expired authorization request state cookie.' });
      return;
    }

    if (!safeEqual(expectedSignature, providedSignature)) {
      callback(null, false, { message: 'Invalid authorization request state cookie.' });
      return;
    }

    if (!safeEqual(expectedState, providedState)) {
      callback(null, false, { message: 'Invalid authorization request state.' });
      return;
    }

    callback(null, true);
  }
}
