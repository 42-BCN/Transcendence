import { Router } from "express";
import passport from "passport";

import { validateBody } from "@shared/validation.middleware";
import {
  LoginReqSchema,
  ResendVerificationReqSchema,
  SignupReqSchema,
} from "@contracts/auth/auth.validation";
import { RecoverReqSchema } from "@contracts/auth/auth.recover.caro";

import {
  postLogin,
  postRecover,
  postResendVerification,
  postSignup,
  postLogout,
  getGoogleCallback,
} from "./auth.controller";
import {
  createEmailFlowRateLimit,
  loginIdentifierRateLimit,
  loginIpRateLimit,
  resendVerificationEmailRateLimit,
  signupEmailRateLimit,
} from "./auth.rate-limit";

export const authRouter = Router();

authRouter.post(
  "/signup",
  validateBody(SignupReqSchema),
  signupEmailRateLimit,
  postSignup,
);
authRouter.post(
  "/login",
  loginIpRateLimit,
  validateBody(LoginReqSchema),
  loginIdentifierRateLimit,
  postLogin,
);
authRouter.post(
  "/recover",
  validateBody(RecoverReqSchema),
  createEmailFlowRateLimit((req) => {
    const identifier = req.body?.identifier;
    return typeof identifier === "string" && identifier.includes("@")
      ? identifier
      : undefined;
  }),
  postRecover,
);
authRouter.post(
  "/resend-verification",
  validateBody(ResendVerificationReqSchema),
  resendVerificationEmailRateLimit,
  postResendVerification,
);
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);
authRouter.get("/callback/google", getGoogleCallback);
authRouter.post("/logout", postLogout);
