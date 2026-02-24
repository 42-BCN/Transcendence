import type { Request, Response } from "express";

import type { UsersListResponse } from "../contracts/api/users/users.contracts";
import { getUsers } from "./users.service";
import type { GetUsersQuery } from "../contracts/api/users/users.validation";

type Locals = { query: GetUsersQuery };

export async function getUsersController(
  req: Request,
  res: Response<UsersListResponse, Locals>,
): Promise<void> {
  const result = await getUsers(res.locals.query);
  if (!result.ok) return;

  const body: UsersListResponse = {
    ok: true,
    data: {
      users: result.value,
      meta: {
        limit: res.locals.query.limit,
        offset: res.locals.query.offset,
        count: result.value.length,
      },
    },
  };
  res.status(200).json(body);
  return;
}
