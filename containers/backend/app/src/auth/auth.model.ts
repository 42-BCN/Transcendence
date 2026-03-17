import type { AuthUser } from "@contracts/auth/auth.contract";

export type AuthUserRow = {
  id: string;
  email: string;
  username: string;
  password_hash: string | null;
  provider: "local" | "google";
  google_id: string | null;
  is_blocked: boolean;
};

export function toAuthUser(row: {
  id: string;
  email: string;
  username: string;
}): AuthUser {
  return { id: row.id, email: row.email, username: row.username };
}
