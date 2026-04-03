import type { AuthUser } from "@contracts/auth/auth.contract";

export type AuthUserRow = {
  id: string;
  email: string;
  username: string;
  passwordHash: string | null;
  provider: "local" | "google";
  googleId: string | null;
  isBlocked: boolean;
  failedAttempts: number;
  lockedUntil: Date | null;
  emailVerifiedAt: Date | null;
};

export function toAuthUser(row: {
  id: string;
  email: string;
  username: string;
}): AuthUser {
  return { id: row.id, email: row.email, username: row.username };
}
