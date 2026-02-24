import { listUsers } from "./users.repo";
import { Ok, type Result } from "../shared/result-helpers";
import type {
  UserPublic,
  UsersListError,
} from "../contracts/api/users/users.contracts";

export async function getUsers(input?: {
  limit?: number;
  offset?: number;
}): Promise<Result<UserPublic[], UsersListError>> {
  const limit = Math.min(Math.max(input?.limit ?? 20, 1), 100);
  const offset = Math.max(input?.offset ?? 0, 0);

  return Ok(await listUsers(limit, offset));
}
