import type { UserPublic } from "@contracts/users/users.contracts";

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

export async function findUserById(id: string): Promise<UserPublic> {
  const data = await selectUserData(id);
  return data;
}
