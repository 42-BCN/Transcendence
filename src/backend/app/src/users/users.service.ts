import type { UserPublic, UserPublicResponse } from "@contracts/users/users.contracts";
import { ApiError } from "@shared";

import { listUsers, selectUserData } from "./users.repo";

type getUsersProps = {
  limit: number;
  offset: number;
};

export async function getUsers(args: getUsersProps): Promise<UserPublic[]> {
  const { limit, offset } = args;
  const data = await listUsers(limit, offset);
  return data;
}

export async function findUserById(id: string): Promise<UserPublicResponse> {
  const data = await selectUserData(id);
  if (!data) throw new ApiError("USER_NOT_FOUND");
  return data;
}
