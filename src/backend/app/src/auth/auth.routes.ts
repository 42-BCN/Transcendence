import { Router } from "express";
import passport from "passport";

import { postLogin, postSignup, postLogout } from "./auth.controller";
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
authRouter.get("/callback/google", (req, res, next) => {
  passport.authenticate("google", (err: unknown, userId: string | false) => {
    if (err) return next(err);
    if (!userId) return res.redirect("/login");

    req.session.userId = userId;

    return res.redirect("/");
  })(req, res, next);
});
authRouter.post("/logout", postLogout);
