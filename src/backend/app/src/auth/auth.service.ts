import bcrypt from "bcrypt";
import type { Profile } from "passport";
import type { AuthUser } from "@contracts/auth/auth.contract";
import type { LoginReq } from "@contracts/auth/auth.validation";
import { generateUsername, ApiError } from "@shared";

import { toAuthUser } from "./auth.model";
import * as Repo from "./auth.repo";

export async function login(input: LoginReq): Promise<AuthUser> {
  const identifier = input.identifier.trim().toLowerCase();

  const user = identifier.includes("@")
    ? await Repo.findUserByEmail(identifier)
    : await Repo.findUserByUsername(identifier);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(input.password, user.password_hash);
  if (!ok) throw new ApiError("AUTH_INVALID_CREDENTIALS");

  return toAuthUser(user);
}

export async function signup(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();

  const existing = await Repo.findUserByEmail(email);
  if (existing) throw new ApiError("AUTH_EMAIL_ALREADY_EXISTS");

  const passwordHash = await bcrypt.hash(input.password, 12);

  for (let attempt = 0; attempt < 5; attempt++) {
    const username = generateUsername();

    const created = await Repo.insertUser({ email, username, passwordHash });
    if (created) return toAuthUser(created);
  }

  throw new ApiError("INTERNAL_ERROR");
}

function getUserProfile(profile: Profile) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const username = generateUsername();
  return { googleId, email, username };
}

export async function findOrCreateGoogleUser(
  profile: Profile,
): Promise<AuthUser> {
  const { googleId, email, username } = getUserProfile(profile);

  if (!email) throw new ApiError("AUTH_EMAIL_NOT_VERIFIED");

  const byGoogle = await Repo.findUserByGoogleId(googleId);
  if (byGoogle) return toAuthUser(byGoogle);

  const byEmail = await Repo.findUserByEmail(email);
  if (byEmail) {
    const linked = await Repo.linkGoogleIdToEmailUser({ email, googleId });
    return toAuthUser(linked);
  }

  const created = await Repo.insertGoogleUser({ email, googleId, username });
  return toAuthUser(created);
}

// export async function me(userId: string): Promise<AuthUser> {
//   const user = await Repo.findUserById(userId);
//   if (!user) throw new Error(AUTH_ERRORS.UNAUTHORIZED);
//   return toAuthUser(user);
// }
