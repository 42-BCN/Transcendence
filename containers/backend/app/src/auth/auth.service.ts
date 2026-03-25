import argon2 from "argon2";
import crypto from "crypto";
import type { Profile } from "passport";
import { DatabaseError } from "pg";

import type { AuthRecoverUser, AuthUser } from "@contracts/auth/auth.contract";
import type { LoginReq } from "@contracts/auth/auth.validation";
import { generateUsername, ApiError } from "@shared";

import { /*Delete*/ type AuthUserRow, toAuthUser } from "./auth.model";
import * as Repo from "./auth.repo";

const RECOVER_ALLOW_ATTEMPTS = 5;

export async function login(input: LoginReq): Promise<AuthUser> {
  const identifier = input.identifier.trim().toLowerCase();

  const user = identifier.includes("@")
    ? await Repo.findUserByEmail(identifier)
    : await Repo.findUserByUsername(identifier);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  if (!user.password_hash) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  const ok = await argon2.verify(user.password_hash, input.password);
  if (!ok) throw new ApiError("AUTH_INVALID_CREDENTIALS");

  return toAuthUser(user);
}

export async function signup(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const email = input.email;

  const existing = await Repo.findUserByEmail(email);
  if (existing) throw new ApiError("AUTH_EMAIL_ALREADY_EXISTS");

  const passwordHash = await argon2.hash(input.password);

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

/*
 * RECOVERY utils
 *  */
function generateRecoveryToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}
async function setRecoveryToken(id: string): Promise<string | null> {
  let recoverToken = null;

  for (let not_done = 1; not_done <= 5; ++not_done) {
    try {
      recoverToken = generateRecoveryToken();
      await Repo.setRecoveryToken(id, recoverToken);
      break;
    } catch (err) {
      if (!(err instanceof DatabaseError) || err.code !== "23505") throw err;
      recoverToken = null;
    }
  }
  return recoverToken;
}
//FIXING COMPLEXITY PROBLEM MAY BE A PROBLEM
function identifyIntentifier(identifier: string): "email" | "username" {
  return identifier.includes(`@`) ? "email" : "username";
}
function checkRecoverUser(user: AuthRecoverUser | null): AuthRecoverUser {
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  if (user.is_blocked) throw new ApiError("AUTH_ACCOUNT_LOCKED");
  if (user.recover_attempts > RECOVER_ALLOW_ATTEMPTS)
    throw new ApiError("AUTH_TOO_MANY_REQUEST");
  if (user.recover_token_expiration.getTime() < Date.now())
    throw new ApiError("AUTH_TOKEN_EXPIRED");
  return user;
}

/*
 * RECOVERY PROCESS
 *  */
export async function processRecovery(
  identifier: string,
): Promise<string | null> {
  const key = identifyIntentifier(identifier);
  const user = await Repo.findUserForRecovery(key, identifier);

  if (!user) throw new ApiError("AUTH_ACCOUNT_NOT_FOUND");
  if (user.is_blocked) throw new ApiError("AUTH_ACCOUNT_LOCKED");
  if (user.recover_attempts > RECOVER_ALLOW_ATTEMPTS)
    throw new ApiError("AUTH_TOO_MANY_REQUEST");

  const recoverToken = await setRecoveryToken(user.id);
  if (!recoverToken) throw new ApiError("INTERNAL_ERROR");
  //Enviar email - tal vez esto deberia estar en el controlador
  //await sendRecoveryMail(user.email, recoverToken);

  return recoverToken;
}
export async function validateRecoverToken(
  token: string,
): Promise<AuthRecoverUser | null> {
  const user = await Repo.findUserByToken(token);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  if (user.recover_token_expiration.getTime() < Date.now())
    throw new ApiError("AUTH_TOKEN_EXPIRED");
  return user;
}
export async function updateRecoverAccount(input: {
  token: string;
  password: string;
}): Promise<void> {
  let user = await Repo.findUserByToken(input.token);
  user = checkRecoverUser(user);
  if (!user.recover_token) throw new ApiError("AUTH_UNAUTHORIZED");
  const passwordHash = await argon2.hash(input.password);
  await Repo.updatePasswordRecover(user.id, passwordHash);
}
export async function resendRecMail(
  identifier: string,
): Promise<string | null> {
  const key = identifyIntentifier(identifier);
  let user = await Repo.findUserForRecovery(key, identifier);
  user = checkRecoverUser(user);
  if (!user.recover_token) throw new ApiError("AUTH_UNAUTHORIZED");
  //Enviar email - tal vez esto deberia estar en el controlador
  //await sendRecoveryMail(user.email, recoverToken);
  return user.recover_token;
}

//DELETE THIS
export async function readUser(user: string): Promise<AuthUserRow | null> {
  const data = await Repo.selectUser(user);
  return data;
}

// export async function me(userId: string): Promise<AuthUser> {
//   const user = await Repo.findUserById(userId);
//   if (!user) throw new Error(AUTH_ERRORS.UNAUTHORIZED);
//   return toAuthUser(user);
// }
