import type { Request, Response } from "express";

import type {
  UserPublicResponse,
  UsersListResponse,
} from "../contracts/api/users/users.contracts";
import { getUsers, findUserById } from "./users.service";
import type {
  GetUserByIdParam,
  GetUsersQuery,
} from "../contracts/api/users/users.validation";

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
export async function getUserById(
  req: Request<GetUserByIdParam>,
  res: Response<UserPublicResponse>,
): Promise<void> {
  const result = await findUserById(req.params.userId);
  if (!result.ok) {
    res.status(500).json({ ok: false, error: { code: "INVALID " } });
    return;
  }
  res.status(200).json({ ok: true, data: result.value });
}
