import bcrypt from "bcrypt";

import type {
  AuthUser,
  AuthLoginError,
  AuthSignupError,
} from "../contracts/api/auth/auth.contract";
import type { AuthLoginRequest } from "../contracts/api/auth/auth.validation";
import { AUTH_ERRORS } from "../contracts/api/auth/auth.errors";
import { generateUsername } from "../shared/username-generator";
import * as Repo from "./auth.repo";
import { type Result, Err, Ok } from "../shared/result-helpers";

function toAuthUser(row: {
  id: string;
  email: string;
  username: string;
}): AuthUser {
  return { id: row.id, email: row.email, username: row.username };
}

export async function login(
  input: AuthLoginRequest,
): Promise<Result<AuthUser, AuthLoginError>> {
  const identifier = input.identifier.trim().toLowerCase();

  const user = identifier.includes("@")
    ? await Repo.findUserByEmail(identifier)
    : await Repo.findUserByUsername(identifier);

  if (!user) return Err(AUTH_ERRORS.INVALID_CREDENTIALS);

  const ok = await bcrypt.compare(input.password, user.password_hash);
  if (!ok) return Err(AUTH_ERRORS.INVALID_CREDENTIALS);

  return Ok(toAuthUser(user));
}

export async function signup(input: {
  email: string;
  password: string;
}): Promise<Result<AuthUser, AuthSignupError>> {
  const email = input.email.trim().toLowerCase();

  const existing = await Repo.findUserByEmail(email);
  if (existing) {
    return Err(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  for (let attempt = 0; attempt < 5; attempt++) {
    const username = generateUsername();

    const created = await Repo.insertUser({ email, username, passwordHash });
    if (created) Ok(toAuthUser(created));
  }

  return Err(AUTH_ERRORS.INTERNAL_ERROR);
}

// export async function me(userId: string): Promise<AuthUser> {
//   const user = await Repo.findUserById(userId);
//   if (!user) throw new Error(AUTH_ERRORS.UNAUTHORIZED);
//   return toAuthUser(user);
// }
