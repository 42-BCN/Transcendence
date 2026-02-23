import { Router } from "express";

import { getMe, postLogin, postLogout, postSignup } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", postSignup);
authRouter.post("/login", postLogin);
authRouter.post("/logout", postLogout);
authRouter.get("/me", getMe);
