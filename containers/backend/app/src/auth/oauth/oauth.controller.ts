import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { AUTH_ERRORS, type AuthErrorName } from '@contracts/auth/auth.errors';
import { HttpStatus } from '@contracts/http';

function errorStatus(code: AuthErrorName): number {
  return AUTH_ERRORS[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
}

function sendError<TResponse>(res: Response<TResponse>, code: AuthErrorName): void {
  res.status(errorStatus(code)).json({
    ok: false,
    error: { code },
  } as TResponse);
}

function hasStateFailureMessage(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (!('message' in value)) return false;
  const message = value.message;
  return typeof message === 'string' && message.toLowerCase().includes('state');
}

export function getGoogleCallback(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('google', (err: unknown, userId: string | false, info: unknown) => {
    if (err) {
      if (hasStateFailureMessage(err)) return sendError(res, 'AUTH_CSRF_FAILED');
      return next(err);
    }
    if (!userId) {
      if (hasStateFailureMessage(info)) return sendError(res, 'AUTH_CSRF_FAILED');
      return sendError(res, 'AUTH_INTERNAL_ERROR');
    }

    req.session.regenerate((regenErr) => {
      if (regenErr) return next(regenErr);
      req.session.userId = userId;
      req.session.guestId = undefined;
      req.session.guestUsername = undefined;
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.status(302).redirect('/profile');
      });
    });
  })(req, res, next);
}
