import type { Request, Response } from 'express';

import type { ResetPasswordRes } from '@contracts/auth/auth.contract';
import type { RecoverRes } from '@contracts/auth/auth.contract';
import type { ResetPasswordReq, RecoverReq } from '@contracts/auth/auth.validation';

import { normalizeEmailLocale } from '../mail';
import * as Service from './recovery.service';

export async function postRecover(
  req: Request<unknown, unknown, RecoverReq>,
  res: Response<RecoverRes>,
): Promise<void> {
  const locale = normalizeEmailLocale(req.headers['accept-language']?.toString());
  const result = await Service.recover(req.body, locale);

  res.status(200).json({
    ok: true,
    data: result,
  });
}

export async function postResetPassword(
  req: Request<unknown, unknown, ResetPasswordReq>,
  res: Response<ResetPasswordRes>,
): Promise<void> {
  await Service.resetPasswordByToken(req.body);
  res.status(200).json({ ok: true, data: null });
}
