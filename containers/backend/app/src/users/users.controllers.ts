import type { Request, Response } from 'express';

import type { UserPublicResponse, UsersListResponse, SearchUsersResponse } from '@contracts/users/users.contracts';
import type { GetUserByIdParam, GetUsersQuery, SearchUsersQuery } from '@contracts/users/users.validation';

import { getUsers, findUserById, userByUsername, searchUsers } from './users.service';

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

export async function getUserByUsername(
  req: Request<{ username: string }>,
  res: Response<UserPublicResponse>,
): Promise<void> {
  const result = await userByUsername(req.params.username);

  res.status(200).json({ ok: true, data: result });
}

export async function searchUsersController(
  req: Request,
  res: Response<SearchUsersResponse, { query: SearchUsersQuery }>,
): Promise<void> {
  const { q, limit } = res.locals.query;
  const results = await searchUsers(q, limit);
  res.status(200).json({ ok: true, data: { users: results } });
}
