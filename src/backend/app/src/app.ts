import express from "express";

import { usersRouter } from "./users/users.routes";
import { authRouter } from "./auth/auth.routes";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);

export default app;
