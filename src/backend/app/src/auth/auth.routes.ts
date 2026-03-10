import { Router } from "express";
import passport from "passport";

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
} from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", validateBody(SignupReqSchema), postSignup);
authRouter.post("/login", validateBody(LoginReqSchema), postLogin);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get("/callback/google", getGoogleCallback);
authRouter.post("/logout", postLogout);
authRouter.post("/recover", validateBody(RecoverReqSchema), postRecovery);
authRouter.get(
  "/recover/:token",
  validateParams(RecoverParamSchema),
  getRecovery,
);
authRouter.put("/recover", validateBody(RecoverUpdateSchema), putRecovery);

authRouter.get("/admin/:user", validateParams(FullUserSchema), getUser);
