import { listUsers } from "./users.repo";
import type { User } from "./users.model";
// import { Result } from "pg";
import { Ok, type Result } from "../shared/result-helpers";
import type { UsersListError } from "../contracts/api/users/users.contracts";

export async function getUsers(input?: {
  limit?: number;
  offset?: number;
}): Promise<Result<User[], UsersListError>> {
  const limit = Math.min(Math.max(input?.limit ?? 20, 1), 100);
  const offset = Math.max(input?.offset ?? 0, 0);

  return Ok(await listUsers(limit, offset));
}
