import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";
import type { Profile } from "passport";

import type { AuthUser } from "@contracts/auth/auth.contract";
import type { RecoverReq } from "@contracts/auth/auth.recover.caro";
import { normalizeEmail, type LoginReq } from "@contracts/auth/auth.validation";
import { generateUsername, ApiError } from "@shared";
import { MailServiceError, isMailServiceConfigured } from "@lib/mail.service";

import { authSecurityConfig } from "./auth.security.config";
import { toAuthUser } from "./auth.model";
import * as Repo from "./auth.repo";
import { logEvents, type LoginFailureReason } from "./auth.logs";
import {
  type EmailLocale,
  sendPasswordResetEmail,
  sendSignupVerificationEmail,
} from "./auth.mail";

function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    ...authSecurityConfig.argon2,
  });
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function createRawToken(): string {
  return randomBytes(32).toString("hex");
}

function expiresAt(ttlMs: number): Date {
  return new Date(Date.now() + ttlMs);
}

async function createEmailVerificationToken(userId: string): Promise<string> {
  const token = createRawToken();
  await Repo.createEmailVerificationToken({
    userId,
    tokenHash: hashToken(token),
    expiresAt: expiresAt(24 * 60 * 60 * 1000),
  });
  return token;
}

async function createPasswordResetToken(userId: string): Promise<string> {
  const token = createRawToken();
  await Repo.createPasswordResetToken({
    userId,
    tokenHash: hashToken(token),
    expiresAt: expiresAt(60 * 60 * 1000),
  });
  return token;
}

async function dispatchSignupVerificationMail(
  user: AuthUser,
  locale: EmailLocale,
): Promise<void> {
  if (!isMailServiceConfigured()) {
    logEvents.info({
      event: "signup_verification_skipped",
      reason: "mail_not_configured",
      userId: user.id,
    });
    return;
  }

  try {
    const verificationToken = await createEmailVerificationToken(user.id);
    await sendSignupVerificationEmail({
      toEmail: user.email,
      username: user.username,
      verificationToken,
      locale,
    });
  } catch (error) {
    logEvents.info({
      event: "signup_verification_mail_failed",
      userId: user.id,
      error:
        error instanceof MailServiceError
          ? `${error.code}:${error.message}`
          : String(error),
    });
  }
}

async function dispatchPasswordResetMailByIdentifier(
  identifier: string,
  locale: EmailLocale,
): Promise<void> {
  const user = identifier.includes("@")
    ? await Repo.findUserByEmail(identifier)
    : await Repo.findUserByUsername(identifier);

  if (!user) return;
  if (!isMailServiceConfigured()) {
    logEvents.info({
      event: "password_reset_skipped",
      reason: "mail_not_configured",
      userId: user.id,
    });
    return;
  }

  try {
    const resetToken = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail({
      toEmail: user.email,
      username: user.username,
      resetToken,
      locale,
    });
  } catch (error) {
    logEvents.info({
      event: "password_reset_mail_failed",
      userId: user.id,
      error:
        error instanceof MailServiceError
          ? `${error.code}:${error.message}`
          : String(error),
    });
  }
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

  try {
    const ok = await argon2.verify(passwordHash, password);
    if (!ok) return { ok: false, reason: "invalid_password" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "missing_password_hash" };
  }
}

export async function recordFailedPasswordAttempt(
  userId: string,
  userHash: string,
): Promise<void> {
  const { maxFailedAttempts, lockoutDurationMs } = authSecurityConfig;
  const now = new Date();

  const { failedAttempts, lockedUntil } =
    await Repo.incrementFailedAttempts(userId);

  const maxed = failedAttempts >= maxFailedAttempts;
  const unlocked = !lockedUntil || lockedUntil <= now;

  if (!(maxed && unlocked)) return;

  const newLock = await Repo.tryLockUser(userId, now, lockoutDurationMs);
  if (!newLock) return;

  logEvents.lockoutTriggered(
    userId,
    userHash,
    failedAttempts,
    newLock.toISOString(),
  );
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
    await recordFailedPasswordAttempt(user.id, idHash);
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
export async function signup(
  input: {
    email: string;
    password: string;
  },
  locale: EmailLocale = "en",
): Promise<AuthUser> {
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

  await dispatchSignupVerificationMail(result.user, locale);
  return result.user;
}

export async function recover(
  input: RecoverReq,
  locale: EmailLocale = "en",
): Promise<{ identifier: string }> {
  const identifier = input.identifier;
  await dispatchPasswordResetMailByIdentifier(identifier, locale);
  return { identifier };
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
