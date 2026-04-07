import type { Request, Response } from 'express';

import type { LoginRes, SignupRes } from '@contracts/auth/auth.contract';
import { AUTH_ERRORS, type AuthErrorName } from '@contracts/auth/auth.errors';
import type { SignupReq, LoginReq } from '@contracts/auth/auth.validation';
import { HttpStatus, HttpStatusCode } from '@contracts/http';

import { normalizeEmailLocale } from '../mail';
import * as Service from './local.service';

function errorStatus(code: AuthErrorName): number {
  return AUTH_ERRORS[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
}

function sendError<TResponse>(res: Response<TResponse>, code: AuthErrorName): void {
  res.status(errorStatus(code)).json({
    ok: false,
    error: { code },
  } as TResponse);
}

function sendOk<TResponse>(
  res: Response<TResponse>,
  data: TResponse extends { data: infer TData } ? TData : unknown,
  code: HttpStatusCode,
): void {
  res.status(code).json({
    ok: true,
    data,
  } as TResponse);
}

export async function postSignup(
  req: Request<unknown, unknown, SignupReq>,
  res: Response<SignupRes>,
): Promise<void> {
  const locale = normalizeEmailLocale(req.headers['accept-language']?.toString());
  const result = await Service.signup(req.body, locale);
  sendOk(res, { user: result }, 200);
}

export async function postLogin(
  req: Request<unknown, unknown, LoginReq>,
  res: Response<LoginRes>,
): Promise<void> {
  const result = await Service.login(req.body);

  req.session.regenerate((err) => {
    if (err) return sendError(res, 'AUTH_INTERNAL_ERROR');
    req.session.userId = result.id;
    req.session.save((saveErr) => {
      if (saveErr) return sendError(res, 'AUTH_INTERNAL_ERROR');
      sendOk(res, { user: result }, 200);
    });
  });
}

export function postLogout(req: Request, res: Response): void {
  req.session.destroy((err) => {
    if (err) return sendError(res, 'AUTH_INTERNAL_ERROR');

    res.clearCookie('sid', {
      path: '/',
      sameSite: 'lax',
      secure: true,
    });

    sendOk(res, { user: null }, 200);
  });
}
