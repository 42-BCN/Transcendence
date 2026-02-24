import { listUsers } from "./users.repo";
import { Ok, type Result } from "../shared/result-helpers";
import type {
  UserPublic,
  UsersListError,
} from "../contracts/api/users/users.contracts";

export async function getUsers({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<Result<UserPublic[], UsersListError>> {
  const data = await listUsers(limit, offset);
  const response = Ok(data);
  return response;
}
