import { createHash, randomBytes } from 'node:crypto';

import { ApiError, getRedisClient } from '@shared';

import { authSecurityConfig } from '../security.config';
import * as SharedRepo from '../shared.repo';
import * as VerificationRepo from './verification.repo';
import { sendSignupVerificationEmail, type EmailLocale } from '../mail';

type ResendVerificationUser = {
  id: string;
  email: string;
  username: string;
  emailVerifiedAt: Date | null;
};

type ResendVerificationInput = {
  email?: string;
  userId?: string;
  locale: EmailLocale;
};

type ResendVerificationDeps = {
  findUserByEmail: (email: string) => Promise<ResendVerificationUser | null>;
  findUserByIdForVerification: (userId: string) => Promise<ResendVerificationUser | null>;
  acquireCooldown: (userId: string) => Promise<boolean>;
  issueVerificationToken: (userId: string) => Promise<string>;
  sendVerificationEmail: (input: {
    toEmail: string;
    username: string;
    verificationToken: string;
    locale: EmailLocale;
  }) => Promise<void>;
};

function fingerprint(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

function createRawToken(): string {
  return randomBytes(32).toString('hex');
}

function expiresAt(ttlMs: number): Date {
  return new Date(Date.now() + ttlMs);
}

async function issueVerificationToken(userId: string): Promise<string> {
  const token = createRawToken();
  await VerificationRepo.deleteUnusedEmailVerificationTokens(userId);
  await VerificationRepo.createEmailVerificationToken({
    userId,
    tokenHash: createHash('sha256').update(token).digest('hex'),
    expiresAt: expiresAt(24 * 60 * 60 * 1000),
  });
  return token;
}

async function acquireCooldown(userId: string): Promise<boolean> {
  const redis = getRedisClient();
  const ttlSeconds = Math.ceil(authSecurityConfig.resendVerificationCooldownMs / 1000);
  const key = `rl:auth:resend-verification:${fingerprint(userId)}`;
  const result = await redis.set(key, '1', {
    EX: ttlSeconds,
    NX: true,
  });

  return result === 'OK';
}

const defaultDeps: ResendVerificationDeps = {
  findUserByEmail: SharedRepo.findUserByEmail,
  findUserByIdForVerification: SharedRepo.findUserByIdForVerification,
  acquireCooldown,
  issueVerificationToken,
  sendVerificationEmail: sendSignupVerificationEmail,
};

export async function resendVerification(
  input: ResendVerificationInput,
  deps: ResendVerificationDeps = defaultDeps,
): Promise<void> {
  if (!input.email && !input.userId) {
    throw new ApiError('VALIDATION_ERROR');
  }

  let user: ResendVerificationUser | null = null;
  if (input.userId) {
    user = await deps.findUserByIdForVerification(input.userId);
  } else if (input.email) {
    user = await deps.findUserByEmail(input.email);
  }

  if (!user || user.emailVerifiedAt) {
    throw new ApiError('AUTH_RESEND_VERIFICATION_NOT_FOUND');
  }

  const allowed = await deps.acquireCooldown(user.id);
  if (!allowed) {
    throw new ApiError('AUTH_RESEND_VERIFICATION_COOLDOWN');
  }

  try {
    const verificationToken = await deps.issueVerificationToken(user.id);
    await deps.sendVerificationEmail({
      toEmail: user.email,
      username: user.username,
      verificationToken,
      locale: input.locale,
    });
  } catch {
    throw new ApiError('AUTH_INTERNAL_ERROR');
  }
}
