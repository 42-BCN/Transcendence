import type { Request, Response } from "express";

import type {
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthMeResponse,
  AuthSignupResponse,
} from "../contracts/api/auth/auth.contract";
import {
  AUTH_ERRORS,
  AUTH_ERROR_STATUS,
} from "../contracts/api/auth/auth.errors";
import {
  AuthLoginRequestSchema,
  AuthSignupRequestSchema,
} from "../contracts/api/auth/auth.validation";
import { toValidationDetails } from "../shared/validation";
import * as Service from "./auth.service";

function send<ResT>(res: Response, status: number, body: ResT) {
  res.status(status).json(body);
}

function errorStatus(code: string): number {
  return AUTH_ERROR_STATUS[code as keyof typeof AUTH_ERROR_STATUS] ?? 500;
}

// eslint-disable-next-line complexity
export async function postSignup(req: Request, res: Response): Promise<void> {
  const parsed = AuthSignupRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    const body: AuthSignupResponse = {
      ok: false,
      error: {
        code: AUTH_ERRORS.VALIDATION_ERROR,
        details: toValidationDetails(parsed.error),
      },
    };
    return send(res, errorStatus(body.error.code), body);
  }

  try {
    const user = await Service.signup(parsed.data);

    const body: AuthSignupResponse = { ok: true, data: { user } };
    return send(res, 200, body);
  } catch (e) {
    const code = e instanceof Error ? e.message : AUTH_ERRORS.INTERNAL_ERROR;
    const safeCode =
      code === AUTH_ERRORS.EMAIL_ALREADY_EXISTS ||
      code === AUTH_ERRORS.EMAIL_NOT_VERIFIED ||
      code === AUTH_ERRORS.INTERNAL_ERROR
        ? code
        : AUTH_ERRORS.INTERNAL_ERROR;

    const body: AuthSignupResponse = { ok: false, error: { code: safeCode } };
    return send(res, errorStatus(body.error.code), body);
  }
}

// eslint-disable-next-line complexity
export async function postLogin(req: Request, res: Response): Promise<void> {
  const parsed = AuthLoginRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    const body: AuthLoginResponse = {
      ok: false,
      error: {
        code: AUTH_ERRORS.VALIDATION_ERROR,
        details: toValidationDetails(parsed.error),
      },
    };
    return send(res, errorStatus(body.error.code), body);
  }

  try {
    const user = await Service.login(parsed.data);

    // session-cookie auth
    req.session.userId = user.id;

    const body: AuthLoginResponse = { ok: true, data: { user } };
    return send(res, 200, body);
  } catch (e) {
    const code = e instanceof Error ? e.message : AUTH_ERRORS.INTERNAL_ERROR;
    const safeCode =
      code === AUTH_ERRORS.INVALID_CREDENTIALS ||
      code === AUTH_ERRORS.ACCOUNT_LOCKED ||
      code === AUTH_ERRORS.EMAIL_NOT_VERIFIED ||
      code === AUTH_ERRORS.INTERNAL_ERROR
        ? code
        : AUTH_ERRORS.INTERNAL_ERROR;

    const body: AuthLoginResponse = { ok: false, error: { code: safeCode } };
    return send(res, errorStatus(body.error.code), body);
  }
}

export async function postLogout(_req: Request, res: Response): Promise<void> {
  // destroy the session
  _req.session.destroy((err) => {
    if (err) {
      const body: AuthLogoutResponse = {
        ok: false,
        error: { code: AUTH_ERRORS.INTERNAL_ERROR },
      };
      return send(res, errorStatus(body.error.code), body);
    }

    const body: AuthLogoutResponse = { ok: true, data: null };
    return send(res, 200, body);
  });
}

// eslint-disable-next-line complexity
export async function getMe(req: Request, res: Response): Promise<void> {
  const userId = req.session.userId;

  if (!userId) {
    const body: AuthMeResponse = {
      ok: false,
      error: { code: AUTH_ERRORS.UNAUTHORIZED },
    };
    return send(res, errorStatus(body.error.code), body);
  }

  try {
    const user = await Service.me(userId);
    const body: AuthMeResponse = { ok: true, data: { user } };
    return send(res, 200, body);
  } catch (e) {
    const code = e instanceof Error ? e.message : AUTH_ERRORS.INTERNAL_ERROR;
    const safeCode =
      code === AUTH_ERRORS.UNAUTHORIZED || code === AUTH_ERRORS.INTERNAL_ERROR
        ? code
        : AUTH_ERRORS.INTERNAL_ERROR;

    const body: AuthMeResponse = { ok: false, error: { code: safeCode } };
    return send(res, errorStatus(body.error.code), body);
  }
}
