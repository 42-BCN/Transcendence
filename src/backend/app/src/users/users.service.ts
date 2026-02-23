import { listUsers } from "./users.repo";
import type { User } from "./users.model";

export async function getUsers(input?: {
  limit?: number;
  offset?: number;
}): Promise<User[]> {
  const limit = Math.min(Math.max(input?.limit ?? 20, 1), 100);
  const offset = Math.max(input?.offset ?? 0, 0);

  return listUsers(limit, offset);
}