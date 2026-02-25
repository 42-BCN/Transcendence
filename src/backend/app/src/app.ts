import express from "express";

import { usersRouter } from "./users/users.routes";
import { authRouter } from "./auth/auth.routes";
import { errorMiddleware } from "./shared/error-middleware";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.use(errorMiddleware);

export default app;
