import { createHash, randomBytes } from 'node:crypto';
import argon2 from 'argon2';

import type { AuthUser } from '@contracts/auth/auth.contract';
import { type LoginReq } from '@contracts/auth/auth.validation';
import { generateUsername, ApiError } from '@shared';
import { MailServiceError, isMailServiceConfigured } from '@lib/mail.service';

import { authSecurityConfig } from '../security.config';
import { toAuthUser } from '../auth.model';
import { logEvents, type LoginFailureReason } from '../auth.logs';
import { type EmailLocale, sendSignupVerificationEmail } from '../mail';
import * as LocalRepo from './local.repo';
import * as SharedRepo from '../shared.repo';
import * as VerificationRepo from '../verification/verification.repo';

function fingerprint(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    ...authSecurityConfig.argon2,
  });
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function createRawToken(): string {
  return randomBytes(32).toString('hex');
}

function expiresAt(ttlMs: number): Date {
  return new Date(Date.now() + ttlMs);
}

async function createEmailVerificationToken(userId: string): Promise<string> {
  const token = createRawToken();
  await VerificationRepo.deleteUnusedEmailVerificationTokens(userId);
  await VerificationRepo.createEmailVerificationToken({
    userId,
    tokenHash: hashToken(token),
    expiresAt: expiresAt(24 * 60 * 60 * 1000),
  });
  return token;
}

async function dispatchSignupVerificationMail(user: AuthUser, locale: EmailLocale): Promise<void> {
  if (!isMailServiceConfigured()) {
    logEvents.info({
      event: 'signup_verification_skipped',
      reason: 'mail_not_configured',
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
      event: 'signup_verification_mail_failed',
      userId: user.id,
      error: error instanceof MailServiceError ? `${error.code}:${error.message}` : String(error),
    });
  }
}

function failLogin(reason: LoginFailureReason, idHash: string, userId?: string): never {
  logEvents.loginFailure(reason, idHash, userId);
  throw new ApiError('AUTH_INVALID_CREDENTIALS');
}

function isActiveLock(lockedUntil: Date | null, now: Date): boolean {
  return Boolean(lockedUntil && lockedUntil > now);
}

type VerifyPasswordResult = { ok: true } | { ok: false; reason: LoginFailureReason };

async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<VerifyPasswordResult> {
  if (!passwordHash.startsWith('$argon2id$')) return { ok: false, reason: 'missing_password_hash' };

  try {
    const ok = await argon2.verify(passwordHash, password);
    if (!ok) return { ok: false, reason: 'invalid_password' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'missing_password_hash' };
  }
}

export async function recordFailedPasswordAttempt(userId: string, userHash: string): Promise<void> {
  const { maxFailedAttempts, lockoutDurationMs } = authSecurityConfig;
  const now = new Date();

  const { failedAttempts, lockedUntil } = await LocalRepo.incrementFailedAttempts(userId);

  const maxed = failedAttempts >= maxFailedAttempts;
  const unlocked = !lockedUntil || lockedUntil <= now;

  if (!(maxed && unlocked)) return;

  const newLock = await LocalRepo.tryLockUser(userId, now, lockoutDurationMs);
  if (!newLock) return;

  logEvents.lockoutTriggered(userId, userHash, failedAttempts, newLock.toISOString());
}

export async function login(input: LoginReq): Promise<AuthUser> {
  const identifier = input.identifier;
  const isEmailIdentifier = identifier.includes('@');
  const idHash = fingerprint(identifier);

  const user = isEmailIdentifier
    ? await SharedRepo.findUserByEmail(identifier)
    : await SharedRepo.findUserByUsername(identifier);

  if (!user) failLogin('unknown_identifier', idHash);
  if (!user.passwordHash) failLogin('missing_password_hash', idHash, user.id);
  if (user.isBlocked) failLogin('blocked_account', idHash, user.id);

  const now = new Date();
  if (isActiveLock(user.lockedUntil, now)) failLogin('tmp_locked', idHash, user.id);

  const verifyResult = await verifyPassword(input.password, user.passwordHash);
  if (!verifyResult.ok) {
    await recordFailedPasswordAttempt(user.id, idHash);
    failLogin(verifyResult.reason, idHash, user.id);
  }

  if (!user.emailVerifiedAt) throw new ApiError('AUTH_EMAIL_NOT_VERIFIED');

  await LocalRepo.registerSuccessfulPasswordLogin(user.id);
  logEvents.loginSuccess(user.id, idHash);
  return toAuthUser(user);
}

function signupFailure(reason: string, emailHash: string): never {
  logEvents.signupFailure(reason, emailHash);
  if (reason === 'email_already_exists') throw new ApiError('AUTH_EMAIL_ALREADY_EXISTS');
  throw new ApiError('AUTH_INTERNAL_ERROR');
}

type CreateUserResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: 'username_collision_exhausted' };

async function createUserWithRetries(input: {
  email: string;
  passwordHash: string;
}): Promise<CreateUserResult> {
  const { email, passwordHash } = input;

  for (let attempt = 0; attempt < 5; attempt++) {
    const created = await LocalRepo.insertUser({
      email,
      username: generateUsername(),
      passwordHash,
    });

    if (created) {
      logEvents.signupSuccess(created.id, fingerprint(email));
      return { ok: true, user: toAuthUser(created) };
    }
  }
  return { ok: false, reason: 'username_collision_exhausted' };
}

export async function signup(
  input: {
    email: string;
    password: string;
  },
  locale: EmailLocale = 'en',
): Promise<AuthUser> {
  const { email, password } = input;
  const idHash = fingerprint(email);
  logEvents.signupAttempt(idHash);

  const existing = await SharedRepo.findUserByEmail(email);
  if (existing) signupFailure('email_already_exists', idHash);

  const passwordHash = await hashPassword(password);

  const result = await createUserWithRetries({ email, passwordHash });
  if (!result.ok) {
    const duplicate = await SharedRepo.findUserByEmail(email);
    if (duplicate) signupFailure('email_already_exists', idHash);
    signupFailure('username_collision_exhausted', idHash);
  }

  await dispatchSignupVerificationMail(result.user, locale);
  return result.user;
}
