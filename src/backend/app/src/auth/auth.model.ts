import type { AuthUser } from "../contracts/api/auth/auth.contract";

export type AuthUserRow = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
};

export function toAuthUser(row: {
  id: string;
  email: string;
  username: string;
}): AuthUser {
  return { id: row.id, email: row.email, username: row.username };
}
