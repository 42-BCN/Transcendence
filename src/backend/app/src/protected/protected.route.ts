import { Router } from "express";
import { requireAuth } from "@shared";

export const protectedRouter = Router();

protectedRouter.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    userId: req.session.userId,
  });
});
