import type { Request, Response } from "express";

import type {
  AuthLoginResponse,
  AuthSignupResponse,
} from "../contracts/api/auth/auth.contract";
import { AUTH_ERROR_STATUS } from "../contracts/api/auth/auth.errors";
import {
  type AuthSignupRequest,
  type AuthLoginRequest,
} from "../contracts/api/auth/auth.validation";
import * as Service from "./auth.service";

function errorStatus(code: string): number {
  return AUTH_ERROR_STATUS[code as keyof typeof AUTH_ERROR_STATUS] ?? 500;
}

export async function postSignup(
  req: Request<unknown, unknown, AuthSignupRequest>,
  res: Response<AuthSignupResponse>,
): Promise<void> {
  const result = await Service.signup(req.body);

  if (!result.ok) {
    res.status(errorStatus(result.error)).json({
      ok: false,
      error: { code: result.error },
    });
    return;
  }

  res.status(200).json({
    ok: true,
    data: { user: result.value },
  });
}

export async function postLogin(
  req: Request<unknown, unknown, AuthLoginRequest>,
  res: Response<AuthLoginResponse>,
): Promise<void> {
  const result = await Service.login(req.body);

  if (!result.ok) {
    res.status(errorStatus(result.error)).json({
      ok: false,
      error: { code: result.error },
    });
    return;
  }
  
  req.session.userId = result.value.id;
  console.log('after set userId', req.session);
  res.status(200).json({
    ok: true,
    data: { user: result.value },
  });
}

// export async function postLogout(_req: Request, res: Response): Promise<void> {
//   // destroy the session
//   _req.session.destroy((err) => {
//     if (err) {
//       const body: AuthLogoutResponse = {
//         ok: false,
//         error: { code: AUTH_ERRORS.INTERNAL_ERROR },
//       };
//       return send(res, errorStatus(body.error.code), body);
//     }

//     const body: AuthLogoutResponse = { ok: true, data: null };
//     return send(res, 200, body);
//   });
// }

// export async function getMe(req: Request, res: Response): Promise<void> {
//   const userId = req.session.userId;

//   if (!userId) {
//     const body: AuthMeResponse = {
//       ok: false,
//       error: { code: AUTH_ERRORS.UNAUTHORIZED },
//     };
//     return send(res, errorStatus(body.error.code), body);
//   }

//   try {
//     const user = await Service.me(userId);
//     const body: AuthMeResponse = { ok: true, data: { user } };
//     return send(res, 200, body);
//   } catch (e) {
//     const code = e instanceof Error ? e.message : AUTH_ERRORS.INTERNAL_ERROR;
//     const safeCode =
//       code === AUTH_ERRORS.UNAUTHORIZED || code === AUTH_ERRORS.INTERNAL_ERROR
//         ? code
//         : AUTH_ERRORS.INTERNAL_ERROR;

//     const body: AuthMeResponse = { ok: false, error: { code: safeCode } };
//     return send(res, errorStatus(body.error.code), body);
//   }
// }
