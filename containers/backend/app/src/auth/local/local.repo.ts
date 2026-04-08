import { prisma } from '@/lib/prisma';

import { isPrismaErrorCode, type UserPublic, userPublicSelect } from '../shared.repo';

type InsertUserInput = {
  email: string;
  username: string;
  passwordHash: string;
};

export async function insertUser(input: InsertUserInput): Promise<UserPublic | null> {
  const { email, username, passwordHash } = input;

  try {
    return await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        provider: 'local',
      },
      select: userPublicSelect,
    });
  } catch (error) {
    if (isPrismaErrorCode(error, 'P2002')) return null;
    throw error;
  }
}

export async function incrementFailedAttempts(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      failedAttempts: { increment: 1 },
    },
    select: {
      failedAttempts: true,
      lockedUntil: true,
    },
  });
}

export async function tryLockUser(userId: string, now: Date, lockoutDurationMs: number) {
  const lockedUntil = new Date(now.getTime() + lockoutDurationMs);

  const result = await prisma.user.updateMany({
    where: {
      id: userId,
      OR: [{ lockedUntil: null }, { lockedUntil: { lte: now } }],
    },
    data: { lockedUntil },
  });

  return result.count > 0 ? lockedUntil : null;
}

export async function registerSuccessfulPasswordLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });
}
