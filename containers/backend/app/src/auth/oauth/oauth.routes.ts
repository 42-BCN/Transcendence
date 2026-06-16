import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { googleAuthenticateOptions } from './oauth.types';
import { getGoogleCallback } from './oauth.controller';

export const oauthRouter = Router();

function getConfiguredGoogleOauthOrigin(): string | null {
  const value =
    process.env.GOOGLE_CALLBACK_URL?.trim() || process.env.APP_BASE_URL?.trim();

  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getCurrentRequestOrigin(req: Request): string {
  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const forwardedHost = req.get('x-forwarded-host')?.split(',')[0]?.trim();
  const host = forwardedHost || req.get('host') || '';

  return `${forwardedProto || req.protocol}://${host}`;
}

function ensureGoogleOauthStartsOnCallbackHost(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const publicOrigin = getConfiguredGoogleOauthOrigin();

  if (!publicOrigin) {
    next();
    return;
  }

  const currentOrigin = getCurrentRequestOrigin(req);

  if (currentOrigin === publicOrigin) {
    next();
    return;
  }

  res.redirect(302, `${publicOrigin}/api/auth/google`);
}

oauthRouter.get(
  '/google',
  ensureGoogleOauthStartsOnCallbackHost,
  passport.authenticate(
    'google',
    googleAuthenticateOptions as unknown as passport.AuthenticateOptions,
  ),
);
oauthRouter.get('/callback/google', getGoogleCallback);
