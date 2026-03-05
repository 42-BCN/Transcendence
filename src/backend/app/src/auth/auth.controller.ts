import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { LoginRes, SignupRes } from "@contracts/auth/auth.contract";
import { AUTH_ERRORS, type AuthErrorName } from "@contracts/auth/auth.errors";
import type {
  SignupReq,
  LoginReq,
  RecoverReq,
} from "@contracts/auth/auth.validation";
import { HttpStatus } from "@contracts/http";

import * as Service from "./auth.service";

// TODO this is repeated at error middleware - make a helper
function errorStatus(code: AuthErrorName): number {
  return AUTH_ERRORS[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
}

// TODO this is repeated at error middleware - make a helper
export function sendError<TResponse>(
  res: Response<TResponse>,
  code: AuthErrorName,
): void {
  res.status(errorStatus(code)).json({
    ok: false,
    error: { code },
  } as TResponse);
}

export async function postSignup(
  req: Request<unknown, unknown, SignupReq>,
  res: Response<SignupRes>,
): Promise<void> {
  const result = await Service.signup(req.body);

  res.status(200).json({
    ok: true,
    data: { user: result },
  });
}

export async function postLogin(
  req: Request<unknown, unknown, LoginReq>,
  res: Response<LoginRes>,
): Promise<void> {
  const result = await Service.login(req.body);

  // this is a callback function, will have another stack so dont throw here!
  // TODO another option is convert the callback to promise form
  req.session.regenerate((err) => {
    if (err) return sendError(res, "AUTH_INTERNAL_ERROR");
    req.session.userId = result.id;
    req.session.save((saveErr) => {
      if (saveErr) return sendError(res, "AUTH_INTERNAL_ERROR");

      res.status(200).json({
        ok: true,
        data: { user: result },
      });
    });
  });
}

export function postLogout(req: Request, res: Response): void {
  // this is a callback function, will have another stack so dont throw here!
  // TODO another option is convert the callback to promise form
  req.session.destroy((err) => {
    if (err) return sendError(res, "AUTH_INTERNAL_ERROR");

    res.clearCookie("sid", {
      path: "/",
      sameSite: "lax",
      secure: true,
    });

    res.status(200).json({ ok: true, data: null });
  });
}
export const recoverAccount = async (
  req: Request<unknown, unknown, RecoverReq>,
  res: Response,
): Promise<void> => {
  const { email, username } = req.body;

  //Tal vez deberiamos no esperar a que termine
  await Service.processRecovery({ email, username });

  res.status(200).json({ ok: true, data: null });
};

export function getGoogleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // this is a callback function, will have another stack so dont throw here!
  // TODO another option is convert the callback to promise form
  passport.authenticate("google", (err: unknown, userId: string | false) => {
    if (err) return next(err);
    if (!userId) return sendError(res, "AUTH_INTERNAL_ERROR");

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
