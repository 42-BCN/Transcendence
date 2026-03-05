import type { Request, Response } from "express";

import type {
  UserPublicResponse,
  UsersListResponse,
} from "@contracts/users/users.contracts";
import type {
  GetUserByIdParam,
  GetUsersQuery,
} from "@contracts/users/users.validation";

import { getUsers, findUserById } from "./users.service";

type Locals = { query: GetUsersQuery };

export async function getUsersController(
  req: Request,
  res: Response<UsersListResponse, Locals>,
): Promise<void> {
  const result = await getUsers(res.locals.query);

  const body: UsersListResponse = {
    ok: true,
    data: {
      users: result,
      meta: {
        limit: res.locals.query.limit,
        offset: res.locals.query.offset,
        count: result.length,
      },
    },
  };
  res.status(200).json(body);
  return;
}

export async function getUserById(
  req: Request<GetUserByIdParam>,
  res: Response<UserPublicResponse>,
): Promise<void> {
  const result = await findUserById(req.params.userId);
  res.status(200).json({ ok: true, data: result });
}
