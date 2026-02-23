import bcrypt from "bcrypt";

import type { AuthUser } from "../contracts/api/auth/auth.contract";
import { AUTH_ERRORS } from "../contracts/api/auth/auth.errors";
import * as Repo from "./auth.repo";

function toAuthUser(row: {
  id: string;
  email: string;
  username: string;
}): AuthUser {
  return { id: row.id, email: row.email, username: row.username };
}

function makeUsernameFromEmail(email: string): string {
  // change for somenthing like moxfield latter
  const base = email.split("@")[0] ?? "user";
  return (
    base
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .toLowerCase()
      .slice(0, 30) || "user"
  );
}

export async function login(input: {
  identifier: string;
  password: string;
}): Promise<AuthUser> {
  const identifier = input.identifier.trim().toLowerCase();

  const user = identifier.includes("@")
    ? await Repo.findUserByEmail(identifier)
    : await Repo.findUserByUsername(identifier);

  if (!user) throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);

  const ok = await bcrypt.compare(input.password, user.password_hash);
  if (!ok) throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);

  // If you later implement email verification / lockouts, enforce here:
  // throw new Error(AUTH_ERRORS.EMAIL_NOT_VERIFIED);

  return toAuthUser(user);
}

export async function signup(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();

  // Prevent duplicate email
  const existing = await Repo.findUserByEmail(email);
  if (existing) throw new Error(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);

  const passwordHash = await bcrypt.hash(input.password, 12);

  // username is required by your AuthUser + DB table
  // Create a base username and if conflict happens, retry with suffix.
  const base = makeUsernameFromEmail(email);

  for (let attempt = 0; attempt < 5; attempt++) {
    const username =
      attempt === 0 ? base : `${base}_${Math.floor(Math.random() * 10_000)}`;

    const created = await Repo.insertUser({ email, username, passwordHash });
    if (created) return toAuthUser(created);

    // Could be conflict on username; retry
  }

  // If we keep colliding, treat as internal for now
  throw new Error(AUTH_ERRORS.INTERNAL_ERROR);
}

export async function me(userId: string): Promise<AuthUser> {
  const user = await Repo.findUserById(userId);
  if (!user) throw new Error(AUTH_ERRORS.UNAUTHORIZED);
  return toAuthUser(user);
}
