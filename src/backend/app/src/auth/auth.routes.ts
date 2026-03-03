import { Router } from "express";
import passport from "passport";

import {
  postLogin,
  postSignup,
  postLogout,
  getGoogleCallback,
} from "./auth.controller";
import { validateBody } from "../shared/validation";
import {
  AuthLoginRequestSchema,
  AuthSignupRequestSchema,
} from "../contracts/api/auth/auth.validation";

export const authRouter = Router();

authRouter.post("/signup", validateBody(AuthSignupRequestSchema), postSignup);
authRouter.post("/login", validateBody(AuthLoginRequestSchema), postLogin);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get("/callback/google", getGoogleCallback);
authRouter.post("/logout", postLogout);
