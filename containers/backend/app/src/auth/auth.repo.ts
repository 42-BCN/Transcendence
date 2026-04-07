import { ApiError } from '@shared';
import { prisma } from '@/lib/prisma';

import type { AuthUserRow } from './auth.model';

type UserPublic = Pick<AuthUserRow, 'id' | 'email' | 'username'>;
type UserVerification = Pick<AuthUserRow, 'id' | 'email' | 'username' | 'emailVerifiedAt'>;
type UserWithPassword = Pick<
  AuthUserRow,
  | 'id'
  | 'email'
  | 'username'
  | 'passwordHash'
  | 'isBlocked'
  | 'failedAttempts'
  | 'lockedUntil'
  | 'emailVerifiedAt'
>;

const userPublicSelect = {
  id: true,
  email: true,
  username: true,
} as const;

const userVerificationSelect = {
  id: true,
  email: true,
  username: true,
  emailVerifiedAt: true,
} as const;

const userWithPasswordSelect = {
  id: true,
  email: true,
  username: true,
  passwordHash: true,
  isBlocked: true,
  failedAttempts: true,
  lockedUntil: true,
  emailVerifiedAt: true,
} as const;

export function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { email },
    select: userWithPasswordSelect,
  });
}

export function findUserByUsername(username: string): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { username },
    select: userWithPasswordSelect,
  });
}

export function findUserById(id: string): Promise<UserPublic | null> {
  return prisma.user.findUnique({
    where: { id },
    select: userPublicSelect,
  });
}

export function findUserByIdForVerification(id: string): Promise<UserVerification | null> {
  return prisma.user.findUnique({
    where: { id },
    select: userVerificationSelect,
  });
}

export function findUserByGoogleId(googleId: string): Promise<UserPublic | null> {
  return prisma.user.findUnique({
    where: { googleId },
    select: userPublicSelect,
  });
}

function isPrismaErrorCode(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

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

type LinkGoogleIdToEmailUserInput = {
  email: string;
  googleId: string;
};

export async function linkGoogleIdToEmailUser(
  input: LinkGoogleIdToEmailUserInput,
): Promise<UserPublic> {
  const { email, googleId } = input;

  try {
    return await prisma.user.update({
      where: { email },
      data: {
        googleId,
      },
      select: userPublicSelect,
    });
  } catch (error) {
    if (isPrismaErrorCode(error, 'P2025') || isPrismaErrorCode(error, 'P2002'))
      throw new ApiError('AUTH_GOOGLE_LINK_FAILED');
    throw error;
  }
}

type InsertGoogleUserInput = {
  email: string;
  googleId: string;
  username: string;
};

export async function insertGoogleUser(input: InsertGoogleUserInput): Promise<UserPublic> {
  const { email, googleId, username } = input;

  try {
    return await prisma.user.create({
      data: {
        email,
        username,
        googleId,
        provider: 'google',
      },
      select: userPublicSelect,
    });
  } catch (error) {
    if (isPrismaErrorCode(error, 'P2002')) throw new ApiError('AUTH_GOOGLE_USER_INSERT_FAILED');
    throw error;
  }
}

// -------------------------- Failed Password Attempt start --------------------------

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

// -------------------------- Failed Password Attempt end --------------------------

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

type CreateEmailVerificationInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

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

type CreatePasswordResetInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export async function createPasswordResetToken(input: CreatePasswordResetInput): Promise<void> {
  await prisma.passwordReset.create({
    data: {
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    },
  });
}
