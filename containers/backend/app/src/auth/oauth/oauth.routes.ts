import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { googleAuthenticateOptions } from './oauth.types';
import { getGoogleCallback } from './oauth.controller';

export const oauthRouter = Router();

function getConfiguredPublicOrigin(): string | null {
  const value = process.env.APP_BASE_URL?.trim();

  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function ensureGoogleOauthStartsOnPublicHost(req: Request, res: Response, next: NextFunction): void {
  const publicOrigin = getConfiguredPublicOrigin();

  if (!publicOrigin) {
    next();
    return;
  }

  const currentOrigin = `${req.protocol}://${req.get('host')}`;

  if (currentOrigin === publicOrigin) {
    next();
    return;
  }

  res.redirect(302, `${publicOrigin}/api/auth/google`);
}

oauthRouter.get(
  '/google',
  ensureGoogleOauthStartsOnPublicHost,
  passport.authenticate(
    'google',
    googleAuthenticateOptions as unknown as passport.AuthenticateOptions,
  ),
);
oauthRouter.get('/callback/google', getGoogleCallback);
