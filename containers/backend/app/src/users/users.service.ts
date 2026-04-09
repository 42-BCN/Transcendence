import type { UserPublic } from '@contracts/users/users.contracts';
import { ApiError } from '@shared';

import { listUsers, selectUserData, selectUserDataByUsername, searchUsersByUsername } from './users.repo';

type getUsersProps = {
  limit: number;
  offset: number;
};

export async function getUsers(args: getUsersProps): Promise<UserPublic[]> {
  const { limit, offset } = args;
  const data = await listUsers(limit, offset);
  return data;
}

export async function findUserById(id: string): Promise<UserPublic> {
  const data = await selectUserData(id);
  if (!data) throw new ApiError('USER_NOT_FOUND');
  return data;
}

export async function userByUsername(username: string): Promise<UserPublic> {
  const data = await selectUserDataByUsername(username);
  if (!data) throw new ApiError('USER_NOT_FOUND');
  return data;
}

export async function searchUsers(query: string, limit: number): Promise<UserPublic[]> {
  return await searchUsersByUsername(query, limit);
}
