import { prisma } from '@/lib/prisma';

import { tokenTargetUserSelect } from '../shared.repo';

type CreateEmailVerificationInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

type TokenTargetUser = {
  id: string;
  email: string;
  username: string;
  isBlocked: boolean;
};

type TokenValidationResult =
  | { ok: true; user: TokenTargetUser }
  | { ok: false; reason: 'not_found_or_used' | 'expired' };

export async function createEmailVerificationToken(
  input: CreateEmailVerificationInput,
): Promise<void> {
  await prisma.emailVerification.create({
    data: {
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    },
  });
}

export async function deleteUnusedEmailVerificationTokens(userId: string): Promise<void> {
  await prisma.emailVerification.deleteMany({
    where: {
      userId,
      usedAt: null,
    },
  });
}

export async function consumeEmailVerificationToken(
  tokenHash: string,
  now: Date,
): Promise<TokenValidationResult> {
  const token = await prisma.emailVerification.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      expiresAt: true,
      usedAt: true,
      user: {
        select: tokenTargetUserSelect,
      },
    },
  });

  if (!token || token.usedAt || !token.user) return { ok: false, reason: 'not_found_or_used' };
  if (token.expiresAt <= now) return { ok: false, reason: 'expired' };

  const consumed = await prisma.emailVerification.updateMany({
    where: {
      id: token.id,
      usedAt: null,
    },
    data: {
      usedAt: now,
    },
  });

  if (consumed.count !== 1) return { ok: false, reason: 'not_found_or_used' };

  const updated = await prisma.user.update({
    where: { id: token.user.id },
    data: { emailVerifiedAt: now },
    select: tokenTargetUserSelect,
  });

  return { ok: true, user: updated };
}
