import type { Request, Response } from "express";

import type { UsersListResponse } from "../contracts/api/users/users.contracts";
import { getUsers } from "./users.service";
import type { GetUsersQuery } from "../contracts/api/users/users.validation";

export async function getUsersController(
  req: Request<unknown, unknown, unknown, GetUsersQuery>,
  res: Response,
): Promise<void> {
  const result = await getUsers(req.query);

  if (!result.ok) return;

  const body: UsersListResponse = {
    ok: true,
    data: {
      users: result.value,
      meta: {
        limit: req.query.limit,
        offset: req.query.offset,
        count: result.value.length,
      },
    },
  };
  res.status(200).json(body);
  return;
}
