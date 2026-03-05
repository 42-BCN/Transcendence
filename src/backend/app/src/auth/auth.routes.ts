import { Router } from "express";
import passport from "passport";
import { validateBody } from "@shared/validation.middleware";
import {
  LoginReqSchema,
  SignupReqSchema,
} from "@contracts/auth/auth.validation";

import {
  postLogin,
  postSignup,
  postLogout,
  getGoogleCallback,
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
