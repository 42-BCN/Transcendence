import { Router } from "express";
import passport from "passport";

import { recoverLimiter } from "@shared/utils/rate-limiter";
import { validateBody, validateParams } from "@shared/validation.middleware";
import {
  LoginReqSchema,
  RecoverReqSchema,
  RecoverUpdateSchema,
  SignupReqSchema,
  RecoverParamSchema,
  FullUserSchema,
} from "@contracts/auth/auth.validation";

import {
  postLogin,
  postSignup,
  postLogout,
  getGoogleCallback,
  postRecovery,
  putRecovery,
  getRecovery,
  getUser,
  postRecResend,
} from "./auth.controller";

export const authRouter = Router();

authRouter.use("/recover", recoverLimiter);

authRouter.post("/signup", validateBody(SignupReqSchema), postSignup);
authRouter.post("/login", validateBody(LoginReqSchema), postLogin);
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);
authRouter.get("/callback/google", getGoogleCallback);
authRouter.post("/logout", postLogout);

/* *
 * Recover endpoints
 */
authRouter.post("/recover", validateBody(RecoverReqSchema), postRecovery);
authRouter.get(
  "/recover/:token",
  validateParams(RecoverParamSchema),
  getRecovery,
);
authRouter.put("/recover", validateBody(RecoverUpdateSchema), putRecovery);
authRouter.post(
  "/recover/resend",
  validateBody(RecoverReqSchema),
  postRecResend,
);

/* *
 * DELETE testing purpose only
 */
authRouter.get("/admin/:user", validateParams(FullUserSchema), getUser);
