import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import type { Request, Response, CookieOptions } from 'express';
import type OAuth2Strategy from 'passport-oauth2';

import { getAuthCookieSameSite } from '../auth.cookies';

const STATE_COOKIE_NAME = 'google_oauth_state';
const STATE_COOKIE_PATH = '/api/auth/callback/google';
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

type VerifyFailure = { message: string };
type OAuthMetadata = OAuth2Strategy.Metadata;
type StateStoreCallback = OAuth2Strategy.StateStoreStoreCallback;
type StateVerifyCallback = OAuth2Strategy.StateStoreVerifyCallback;

function stateCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: getAuthCookieSameSite(),
    path: STATE_COOKIE_PATH,
    maxAge: STATE_MAX_AGE_MS,
  };
}

function clearStateCookie(res: Response | undefined): void {
  if (!res) return;
  res.clearCookie(STATE_COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: getAuthCookieSameSite(),
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

  store(req: Request, callback: StateStoreCallback): void;
  store(req: Request, meta: OAuthMetadata, callback: StateStoreCallback): void;
  store(
    req: Request,
    metaOrCallback: OAuthMetadata | StateStoreCallback,
    callback?: StateStoreCallback,
  ): void {
    const done = typeof metaOrCallback === 'function' ? metaOrCallback : callback;

    if (!done) {
      throw new Error('OAuth state store callback is required.');
    }

    const res = req.res;

    if (!res) {
      done(new Error('OAuth response object is not available.'), null);
      return;
    }

    const state = randomBytes(24).toString('hex');
    const expiresAt = Date.now() + STATE_MAX_AGE_MS;
    const payload = `${state}.${expiresAt}`;
    const signature = sign(this.secret, payload);

    res.cookie(STATE_COOKIE_NAME, `${payload}.${signature}`, stateCookieOptions());
    done(null, state);
  }

  verify(req: Request, providedState: string, callback: StateVerifyCallback): void;
  verify(
    req: Request,
    providedState: string,
    meta: OAuthMetadata,
    callback: StateVerifyCallback,
  ): void;
  verify(
    req: Request,
    providedState: string,
    metaOrCallback: OAuthMetadata | StateVerifyCallback,
    callback?: StateVerifyCallback,
  ): void {
    const done = typeof metaOrCallback === 'function' ? metaOrCallback : callback;

    if (!done) {
      throw new Error('OAuth state verify callback is required.');
    }

    const cookies = parseCookieHeader(req.headers.cookie);
    const rawCookie = cookies[STATE_COOKIE_NAME];

    clearStateCookie(req.res);

    if (!rawCookie) {
      done(null, false, { message: 'Missing authorization request state cookie.' });
      return;
    }

    const parts = rawCookie.split('.');

    if (parts.length !== 3) {
      done(null, false, { message: 'Malformed authorization request state cookie.' });
      return;
    }

    const expectedState = parts[0];
    const expiresAtRaw = parts[1];
    const providedSignature = parts[2];

    if (
      expectedState === undefined ||
      expiresAtRaw === undefined ||
      providedSignature === undefined
    ) {
      done(null, false, { message: 'Malformed authorization request state cookie.' });
      return;
    }

    const payload = `${expectedState}.${expiresAtRaw}`;
    const expectedSignature = sign(this.secret, payload);
    const expiresAt = Number(expiresAtRaw);

    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      done(null, false, { message: 'Expired authorization request state cookie.' });
      return;
    }

    if (!safeEqual(expectedSignature, providedSignature)) {
      done(null, false, { message: 'Invalid authorization request state cookie.' });
      return;
    }

    if (!safeEqual(expectedState, providedState)) {
      done(null, false, { message: 'Invalid authorization request state.' });
      return;
    }

    done(null, true, null);
  }
}
