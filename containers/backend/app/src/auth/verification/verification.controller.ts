import type { Request, Response } from 'express';

import type { ResendVerificationRes, VerifyEmailRes } from '@contracts/auth/auth.contract';
import { AUTH_ERRORS, type AuthErrorName } from '@contracts/auth/auth.errors';
import type { ResendVerificationReq, VerifyEmailReq } from '@contracts/auth/auth.validation';
import { HttpStatus } from '@contracts/http';

import { normalizeEmailLocale } from '../mail';
import * as Service from './verification.service';

function errorStatus(code: AuthErrorName): number {
  return AUTH_ERRORS[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
}

function sendError<TResponse>(res: Response<TResponse>, code: AuthErrorName): void {
  res.status(errorStatus(code)).json({
    ok: false,
    error: { code },
  } as TResponse);
}

export async function postResendVerification(
  req: Request<unknown, unknown, ResendVerificationReq>,
  res: Response<ResendVerificationRes>,
): Promise<void> {
  const locale = normalizeEmailLocale(req.headers['accept-language']?.toString());

  try {
    await Service.resendVerification({
      email: req.body.email,
      userId: req.session.userId,
      locale,
    });
  } catch (error) {
    const code = (error as { code?: AuthErrorName })?.code;
    // Always mask privacy-sensitive errors to maintain non-enumerating behavior
    // for both authenticated and unauthenticated requests
    if (
      code === 'AUTH_RESEND_VERIFICATION_NOT_FOUND' ||
      code === 'AUTH_RESEND_VERIFICATION_COOLDOWN'
    ) {
      res.status(200).json({ ok: true, data: null });
      return;
    }
    throw error;
  }

  res.status(200).json({
    ok: true,
    data: null,
  });
}

export async function postVerifyEmail(
  req: Request<unknown, unknown, VerifyEmailReq>,
  res: Response<VerifyEmailRes>,
): Promise<void> {
  const user = await Service.verifyEmailByToken(req.body.token);

  req.session.regenerate((regenErr) => {
    if (regenErr) return sendError(res, 'AUTH_INTERNAL_ERROR');
    req.session.userId = user.id;
    req.session.guestId = undefined;
    req.session.guestUsername = undefined;
    req.session.save((saveErr) => {
      if (saveErr) return sendError(res, 'AUTH_INTERNAL_ERROR');
      res.status(200).json({ ok: true, data: null });
    });
  });
}
