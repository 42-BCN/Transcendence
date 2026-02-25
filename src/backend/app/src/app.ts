import express from "express";
import session from "express-session";

import { usersRouter } from "./users/users.routes";
import { authRouter } from "./auth/auth.routes";
import { protectedRouter } from "./protected/protected.route";
import { errorMiddleware } from "./shared/error-middleware";

export const ONE_DAY_MS = 1000 * 60 * 60 * 24;
export const SEVEN_DAYS_MS = ONE_DAY_MS * 7;

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: "auto",
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS_MS,
    },
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);

app.use(errorMiddleware);

export default app;
