import { createHash, randomBytes } from 'node:crypto';

import type { RecoverReq } from '@contracts/auth/auth.validation';
import { ApiError } from '@shared';
import { MailServiceError, isMailServiceConfigured } from '@lib/mail.service';

import { logEvents } from '../auth.logs';
import { type EmailLocale, sendPasswordResetEmail } from '../mail';
import { hashPassword } from '../local/local.service';
import * as RecoveryRepo from './recovery.repo';
import * as SharedRepo from '../shared.repo';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function createRawToken(): string {
  return randomBytes(32).toString('hex');
}

function expiresAt(ttlMs: number): Date {
  return new Date(Date.now() + ttlMs);
}

async function createPasswordResetToken(userId: string): Promise<string> {
  const token = createRawToken();
  await RecoveryRepo.deleteUnusedPasswordResetTokens(userId);
  await RecoveryRepo.createPasswordResetToken({
    userId,
    tokenHash: hashToken(token),
    expiresAt: expiresAt(15 * 60 * 1000),
  });
  return token;
}

async function dispatchPasswordResetMailByIdentifier(
  identifier: string,
  locale: EmailLocale,
): Promise<void> {
  const user = identifier.includes('@')
    ? await SharedRepo.findUserByEmail(identifier)
    : await SharedRepo.findUserByUsername(identifier);

  if (!user) return;
  if (!isMailServiceConfigured()) {
    logEvents.info({
      event: 'password_reset_skipped',
      reason: 'mail_not_configured',
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
      event: 'password_reset_mail_failed',
      userId: user.id,
      error: error instanceof MailServiceError ? `${error.code}:${error.message}` : String(error),
    });
  }
}

export async function recover(
  input: RecoverReq,
  locale: EmailLocale = 'en',
): Promise<{ identifier: string }> {
  const identifier = input.identifier;
  await dispatchPasswordResetMailByIdentifier(identifier, locale);
  return { identifier };
}

export async function resetPasswordByToken(input: {
  token: string;
  password: string;
}): Promise<void> {
  const passwordHash = await hashPassword(input.password);
  const now = new Date();
  const result = await RecoveryRepo.consumePasswordResetToken(
    hashToken(input.token),
    passwordHash,
    now,
  );
  if (!result.ok) throw new ApiError('AUTH_TOKEN_EXPIRED');
  if (result.user.isBlocked) throw new ApiError('AUTH_FORBIDDEN');
}
