import { Router } from "express";

import { postLogin, postSignup } from "./auth.controller";
import { validateBody } from "../shared/validation";
import {
  AuthLoginRequestSchema,
  AuthSignupRequestSchema,
} from "../contracts/api/auth/auth.validation";

export const authRouter = Router();

authRouter.post("/signup", validateBody(AuthSignupRequestSchema), postSignup);
authRouter.post("/login", validateBody(AuthLoginRequestSchema), postLogin);
// authRouter.post("/logout", postLogout);
// authRouter.get("/me", getMe);
