import argon2 from "argon2";
import crypto from "crypto";
import type { Profile } from "passport";
import { DatabaseError } from "pg";

import type { AuthUser } from "@contracts/auth/auth.contract";
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

/*
 * SINGIN utils
 *  */
async function setConfirmToken(id: string): Promise<string | null> {
  let token = null;

  for (let not_done = 1; not_done <= 5; ++not_done) {
    try {
      token = generateToken();
      await Repo.setConfirmToken(id, token);
      break;
    } catch (err) {
      if (!(err instanceof DatabaseError) || err.code !== "23505") throw err;
      token = null;
    }
  }
  return token;
}
async function generateUser(
  email: string,
  passwordHash: string,
): Promise<AuthUser | null> {
  let user: AuthUser | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const username = generateUsername();

    user = await Repo.insertUser({ email, username, passwordHash });
    if (user) break;
  }
  return user;
}

export async function signup(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const email = input.email;

  const existing = await Repo.findUserByEmail(email);
  if (existing) throw new ApiError("AUTH_EMAIL_ALREADY_EXISTS");

  const passwordHash = await argon2.hash(input.password);

  const user = await generateUser(email, passwordHash);
  if (!user) throw new ApiError("INTERNAL_ERROR");

  const token = await setConfirmToken(user.id);
  if (!token) throw new ApiError("AUTH_INTERNAL_ERROR");

  //Controller job?
  //await sendConfirmMail(user.email, token);

  return user;
}

/*
 * VERIFY PROCESS
 *  */
export async function verifyAccount(input: { token: string }): Promise<void> {
  let user = await Repo.findUserByAccountToken(input.token);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  if (user.is_blocked) throw new ApiError("AUTH_ACCOUNT_LOCKED");
  if (user.account_token_expiration.getTime() < Date.now())
    throw new ApiError("AUTH_TOKEN_EXPIRED");
  user = await Repo.verifyAccount(user.id);
  if (!user) throw new ApiError("AUTH_INTERNAL_ERROR");
}
//no need to resturn the token
export async function resendVerifMail(identifier: string): Promise<void> {
  const key = identifyKey(identifier);
  const user = await Repo.findUserForVerify(key, identifier);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  if (user.email_verified_at) throw new ApiError("AUTH_UNAUTHORIZED");
  if (!user.account_token) throw new ApiError("AUTH_UNAUTHORIZED");
  if (user.account_token_expiration.getTime() < Date.now())
    throw new ApiError("AUTH_TOKEN_EXPIRED");

  //Controller job?
  //await sendConfirmMail(user.email, token);
  console.log(`Sending email:`, user.account_token); //DEV borrar
}

function getUserProfile(profile: Profile) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const username = generateUsername();
  return { googleId, email, username };
}

/*
 * GOOGLE PROCESS
 *  */
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
function generateToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}
async function setRecoveryToken(id: string): Promise<string | null> {
  let token = null;

  for (let not_done = 1; not_done <= 5; ++not_done) {
    try {
      token = generateToken();
      await Repo.setRecoveryToken(id, token);
      break;
    } catch (err) {
      if (!(err instanceof DatabaseError) || err.code !== "23505") throw err;
      token = null;
    }
  }
  return token;
}
//FIXING COMPLEXITY PROBLEM MAY BE A PROBLEM
function identifyKey(identifier: string): "email" | "username" {
  return identifier.includes(`@`) ? "email" : "username";
}
function validateRecoverUser(user: Repo.UserRecoverData): AuthUser {
  if (user.is_blocked) throw new ApiError("AUTH_ACCOUNT_LOCKED");
  if (user.recover_attempts > RECOVER_ALLOW_ATTEMPTS)
    throw new ApiError("AUTH_TOO_MANY_REQUEST");
  if (user.recover_token_expiration.getTime() < Date.now())
    throw new ApiError("AUTH_TOKEN_EXPIRED");
  if (!user.recover_token) throw new ApiError("AUTH_UNAUTHORIZED");
  return user;
}

/*
 * RECOVERY PROCESS
 *  */
export async function processRecovery(
  identifier: string,
): Promise<string | null> {
  const key = identifyKey(identifier);
  const user = await Repo.findUserForRecovery(key, identifier);

  if (!user) throw new ApiError("AUTH_ACCOUNT_NOT_FOUND");
  if (user.is_blocked) throw new ApiError("AUTH_ACCOUNT_LOCKED");
  if (user.recover_attempts >= RECOVER_ALLOW_ATTEMPTS)
    throw new ApiError("AUTH_TOO_MANY_REQUEST");

  const recoverToken = await setRecoveryToken(user.id);
  if (!recoverToken) throw new ApiError("INTERNAL_ERROR");
  //Send email - maybe in controller?
  //await sendRecoveryMail(user.email, recoverToken);

  return recoverToken;
}
export async function validateRecoverToken(
  token: string,
): Promise<AuthUser | null> {
  const user = await Repo.findUserByToken(token);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  const validatedUser = validateRecoverUser(user);
  if (!validatedUser) throw new ApiError("AUTH_INTERNAL_ERROR");
  return toAuthUser(validatedUser);
}
export async function updateRecoverAccount(input: {
  token: string;
  password: string;
}): Promise<void> {
  const user = await Repo.findUserByToken(input.token);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  const validatedUser = validateRecoverUser(user);
  if (!validatedUser) throw new ApiError("AUTH_INTERNAL_ERROR");
  const passwordHash = await argon2.hash(input.password);
  await Repo.updatePasswordRecover(validatedUser.id, passwordHash);
}
export async function resendRecMail(identifier: string): Promise<void> {
  const key = identifyKey(identifier);
  const user = await Repo.findUserForRecovery(key, identifier);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS");
  const validatedUser = validateRecoverUser(user);
  if (!validatedUser) throw new ApiError("AUTH_INTERNAL_ERROR");
  //Send email - maybe in controller?
  //await sendRecoveryMail(user.email, recoverToken);
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
