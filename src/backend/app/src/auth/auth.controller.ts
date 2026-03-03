import type { NextFunction, Request, Response } from "express";
import passport from "passport";

import type {
  AuthLoginResponse,
  AuthSignupResponse,
} from "../contracts/api/auth/auth.contract";
import {
  AUTH_ERRORS,
  AUTH_ERROR_STATUS,
} from "../contracts/api/auth/auth.errors";
import {
  type AuthSignupRequest,
  type AuthLoginRequest,
} from "../contracts/api/auth/auth.validation";
import * as Service from "./auth.service";

function errorStatus(code: string): number {
  return AUTH_ERROR_STATUS[code as keyof typeof AUTH_ERROR_STATUS] ?? 500;
}

export function sendError<TResponse>(
  res: Response<TResponse>,
  code: string,
): void {
  res.status(errorStatus(code)).json({
    ok: false,
    error: { code },
  } as TResponse);
}

export async function postSignup(
  req: Request<unknown, unknown, AuthSignupRequest>,
  res: Response<AuthSignupResponse>,
): Promise<void> {
  const result = await Service.signup(req.body);

  res.status(200).json({
    ok: true,
    data: { user: result },
  });
}

export async function postLogin(
  req: Request<unknown, unknown, AuthLoginRequest>,
  res: Response<AuthLoginResponse>,
): Promise<void> {
  const result = await Service.login(req.body);

  // this is a callback function, will have another stack so dont throw here!
  // another option is convert the callback to promise form
  req.session.regenerate((err) => {
    if (err) return sendError(res, AUTH_ERRORS.INTERNAL_ERROR);
    req.session.userId = result.id;
    req.session.save((saveErr) => {
      if (saveErr) return sendError(res, AUTH_ERRORS.INTERNAL_ERROR);

      res.status(200).json({
        ok: true,
        data: { user: result },
      });
    });
  });
}

export function postLogout(req: Request, res: Response): void {
  // this is a callback function, will have another stack so dont throw here!
  // another option is convert the callback to promise form
  req.session.destroy((err) => {
    if (err) return sendError(res, AUTH_ERRORS.INTERNAL_ERROR);

    res.clearCookie("sid", {
      path: "/",
      sameSite: "lax",
      secure: true,
    });

    res.status(200).json({ ok: true, data: null });
  });
}

export function getGoogleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // this is a callback function, will have another stack so dont throw here!
  // another option is convert the callback to promise form
  passport.authenticate("google", (err: unknown, userId: string | false) => {
    if (err) return next(err);
    if (!userId) return sendError(res, AUTH_ERRORS.INTERNAL_ERROR);

    // this could be a middleware? is repeated
    req.session.regenerate((regenErr) => {
      if (regenErr) return next(regenErr);
      req.session.userId = userId;
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.status(200).json({ ok: true, data: null });
      });
    });
  })(req, res, next);
}
