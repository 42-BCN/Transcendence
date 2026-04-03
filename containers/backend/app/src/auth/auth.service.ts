import { createHash } from "node:crypto";
import argon2 from "argon2";
import type { Profile } from "passport";

import type { AuthUser } from "@contracts/auth/auth.contract";
import { normalizeEmail, type LoginReq } from "@contracts/auth/auth.validation";
import { generateUsername, ApiError } from "@shared";

import { authSecurityConfig } from "./auth.security.config";
import { toAuthUser } from "./auth.model";
import * as Repo from "./auth.repo";
import { logEvents, type LoginFailureReason } from "./auth.logs";

function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    ...authSecurityConfig.argon2,
  });
}

// -------------------------- LOGIN HELPER FUNCTIONS --------------------------
function failLogin(
  reason: LoginFailureReason,
  idHash: string,
  userId?: string,
): never {
  logEvents.loginFailure(reason, idHash, userId);
  throw new ApiError("AUTH_INVALID_CREDENTIALS");
}

function isActiveLock(lockedUntil: Date | null, now: Date): boolean {
  return Boolean(lockedUntil && lockedUntil > now);
}

type VerifyPasswordResult =
  | { ok: true }
  | { ok: false; reason: LoginFailureReason };

async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<VerifyPasswordResult> {
  if (!passwordHash.startsWith("$argon2id$"))
    return { ok: false, reason: "missing_password_hash" };

  const ok = await argon2.verify(passwordHash, password);
  if (!ok) return { ok: false, reason: "invalid_password" };
  return { ok: true };
}

async function registerFailedLoginAttempt(
  userId: string,
  idHash: string,
): Promise<void> {
  const now = new Date();
  const failedAttempt = await Repo.recordFailedPasswordAttempt({
    userId,
    now,
    maxFailedAttempts: authSecurityConfig.maxFailedAttempts,
    lockoutDurationMs: authSecurityConfig.lockoutDurationMs,
  });

  if (failedAttempt.lockoutTriggered) {
    logEvents.lockoutTriggered(
      userId,
      idHash,
      failedAttempt.failedAttempts,
      failedAttempt.lockedUntil?.toISOString(),
    );
  }
}

// -------------------------- LOGIN --------------------------
export async function login(input: LoginReq): Promise<AuthUser> {
  const identifier = input.identifier;
  const isEmailIdentifier = identifier.includes("@");
  const idHash = fingerprint(identifier);

  const user = isEmailIdentifier
    ? await Repo.findUserByEmail(identifier)
    : await Repo.findUserByUsername(identifier);

  if (!user) failLogin("unknown_identifier", idHash);
  if (!user.passwordHash) failLogin("missing_password_hash", idHash, user.id);
  if (user.isBlocked) failLogin("blocked_account", idHash, user.id);

  const now = new Date();
  if (isActiveLock(user.lockedUntil, now))
    failLogin("tmp_locked", idHash, user.id);

  const verifyResult = await verifyPassword(input.password, user.passwordHash);
  if (!verifyResult.ok) {
    await registerFailedLoginAttempt(user.id, idHash);
    failLogin(verifyResult.reason, idHash, user.id);
  }

  await Repo.registerSuccessfulPasswordLogin(user.id);
  logEvents.loginSuccess(user.id, idHash);
  return toAuthUser(user);
}

// -------------------------- SIGNUP HELPER FUNCTIONS --------------------------
function signupFailure(reason: string, emailHash: string): never {
  logEvents.signupFailure(reason, emailHash);
  if (reason === "email_already_exists")
    throw new ApiError("AUTH_EMAIL_ALREADY_EXISTS");
  throw new ApiError("AUTH_INTERNAL_ERROR");
}

type CreateUserResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: "username_collision_exhausted" };

async function createUserWithRetries(input: {
  email: string;
  passwordHash: string;
}): Promise<CreateUserResult> {
  const { email, passwordHash } = input;

  for (let attempt = 0; attempt < 5; attempt++) {
    const created = await Repo.insertUser({
      email,
      username: generateUsername(),
      passwordHash,
    });

    if (created) {
      logEvents.signupSuccess(created.id, fingerprint(email));
      return { ok: true, user: toAuthUser(created) };
    }
  }
  return { ok: false, reason: "username_collision_exhausted" };
}

// -------------------------- SIGNUP --------------------------
export async function signup(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const email = input.email;
  const idHash = fingerprint(email);
  logEvents.signupAttempt(idHash);

  const existing = await Repo.findUserByEmail(email);
  if (existing) signupFailure("email_already_exists", idHash);

  const passwordHash = await hashPassword(input.password);

  const result = await createUserWithRetries({ email, passwordHash });
  if (!result.ok) {
    const duplicate = await Repo.findUserByEmail(email);
    if (duplicate) signupFailure("email_already_exists", idHash);
    signupFailure("username_collision_exhausted", idHash);
  }

  return result.user;
}

// -------------------------- GOOGLE OAUTH --------------------------
function getUserProfile(profile: Profile) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const username = generateUsername();
  return {
    googleId,
    email: email ? normalizeEmail(email) : undefined,
    username,
  };
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
