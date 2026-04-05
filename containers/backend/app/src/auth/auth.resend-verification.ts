import { createHash, randomBytes } from "node:crypto";

import { ApiError, getRedisClient } from "@shared";

import { authSecurityConfig } from "./auth.security.config";
import * as Repo from "./auth.repo";
import { sendSignupVerificationEmail } from "./auth.mail";
import type { EmailLocale } from "./mail-templates";

type ResendVerificationUser = {
  id: string;
  email: string;
  username: string;
  emailVerifiedAt: Date | null;
};

export type ResendVerificationInput = {
  email?: string;
  userId?: string;
  locale: EmailLocale;
};

export type ResendVerificationDeps = {
  findUserByEmail: (email: string) => Promise<ResendVerificationUser | null>;
  findUserByIdForVerification: (
    userId: string,
  ) => Promise<ResendVerificationUser | null>;
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
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function createRawToken(): string {
  return randomBytes(32).toString("hex");
}

function expiresAt(ttlMs: number): Date {
  return new Date(Date.now() + ttlMs);
}

async function issueVerificationToken(userId: string): Promise<string> {
  const token = createRawToken();
  await Repo.deleteUnusedEmailVerificationTokens(userId);
  await Repo.createEmailVerificationToken({
    userId,
    tokenHash: createHash("sha256").update(token).digest("hex"),
    expiresAt: expiresAt(24 * 60 * 60 * 1000),
  });
  return token;
}

async function acquireCooldown(userId: string): Promise<boolean> {
  const redis = getRedisClient();
  const ttlSeconds = Math.ceil(
    authSecurityConfig.resendVerificationCooldownMs / 1000,
  );
  const key = `rl:auth:resend-verification:${fingerprint(userId)}`;
  const result = await redis.set(key, "1", {
    EX: ttlSeconds,
    NX: true,
  });

  return result === "OK";
}

const defaultDeps: ResendVerificationDeps = {
  findUserByEmail: Repo.findUserByEmail,
  findUserByIdForVerification: Repo.findUserByIdForVerification,
  acquireCooldown,
  issueVerificationToken,
  sendVerificationEmail: sendSignupVerificationEmail,
};

export async function resendVerification(
  input: ResendVerificationInput,
  deps: ResendVerificationDeps = defaultDeps,
): Promise<void> {
  if (!input.email && !input.userId) {
    throw new ApiError("VALIDATION_ERROR");
  }

  const user = input.userId
    ? await deps.findUserByIdForVerification(input.userId)
    : input.email
      ? await deps.findUserByEmail(input.email)
      : null;

  if (!user || user.emailVerifiedAt) {
    throw new ApiError("AUTH_RESEND_VERIFICATION_NOT_FOUND");
  }

  const allowed = await deps.acquireCooldown(user.id);
  if (!allowed) {
    throw new ApiError("AUTH_RESEND_VERIFICATION_COOLDOWN");
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
    throw new ApiError("AUTH_INTERNAL_ERROR");
  }
}
