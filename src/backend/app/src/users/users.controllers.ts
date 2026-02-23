import type { Request, Response } from "express";

import { getUsers } from "./users.service";

export async function getUsersController(
  req: Request,
  res: Response,
): Promise<void> {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;

  const users = await getUsers({ limit, offset });

  res.json({ users });
}
