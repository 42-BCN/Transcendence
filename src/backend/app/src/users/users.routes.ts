import type { Request, Response } from "express";
import { Router } from "express";

import { getUsers } from "./users.service";

export const usersRouter = Router();

/**
 * GET /users?limit=20&offset=0
 */
usersRouter.get("/", async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;

  const users = await getUsers({ limit, offset });
  res.json({ users });
});
