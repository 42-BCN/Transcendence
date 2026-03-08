import { Router } from "express";
import { requireAuth } from "@shared";
import { getMeProfile } from "./protected.controller";

export const protectedRouter = Router();

protectedRouter.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      userId: req.session.userId,
    },
  });
});

protectedRouter.get("/me/profile", requireAuth, getMeProfile);
