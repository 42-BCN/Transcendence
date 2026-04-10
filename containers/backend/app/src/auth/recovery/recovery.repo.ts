import { prisma } from '@/lib/prisma';

import { tokenTargetUserSelect } from '../shared.repo';

type CreatePasswordResetInput = {
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

export async function createPasswordResetToken(input: CreatePasswordResetInput): Promise<void> {
  await prisma.passwordReset.create({
    data: {
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    },
  });
}

export async function deleteUnusedPasswordResetTokens(userId: string): Promise<void> {
  await prisma.passwordReset.deleteMany({
    where: {
      userId,
      usedAt: null,
    },
  });
}

export async function consumePasswordResetToken(
  tokenHash: string,
  nextPasswordHash: string,
  now: Date,
): Promise<TokenValidationResult> {
  const token = await prisma.passwordReset.findUnique({
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

  const consumed = await prisma.passwordReset.updateMany({
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
    data: {
      passwordHash: nextPasswordHash,
      failedAttempts: 0,
      lockedUntil: null,
    },
    select: tokenTargetUserSelect,
  });

  return { ok: true, user: updated };
}
