import { ApiError } from "@shared";
import { prisma } from "@/lib/prisma";

import type { AuthUserRow } from "./auth.model";

type UserPublic = Pick<AuthUserRow, "id" | "email" | "username">;
type UserWithPassword = Pick<
  AuthUserRow,
  | "id"
  | "email"
  | "username"
  | "passwordHash"
  | "isBlocked"
  | "failedAttempts"
  | "lockedUntil"
  | "emailVerifiedAt"
>;

const userPublicSelect = {
  id: true,
  email: true,
  username: true,
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

export function findUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { email },
    select: userWithPasswordSelect,
  });
}

export function findUserByUsername(
  username: string,
): Promise<UserWithPassword | null> {
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

export function findUserByGoogleId(
  googleId: string,
): Promise<UserPublic | null> {
  return prisma.user.findUnique({
    where: { googleId },
    select: userPublicSelect,
  });
}

function isPrismaErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

type InsertUserInput = {
  email: string;
  username: string;
  passwordHash: string;
};

export async function insertUser(
  input: InsertUserInput,
): Promise<UserPublic | null> {
  const { email, username, passwordHash } = input;

  try {
    return await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        provider: "local",
      },
      select: userPublicSelect,
    });
  } catch (error) {
    if (isPrismaErrorCode(error, "P2002")) return null;
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
    if (isPrismaErrorCode(error, "P2025") || isPrismaErrorCode(error, "P2002"))
      throw new ApiError("AUTH_GOOGLE_LINK_FAILED");
    throw error;
  }
}

type InsertGoogleUserInput = {
  email: string;
  googleId: string;
  username: string;
};

export async function insertGoogleUser(
  input: InsertGoogleUserInput,
): Promise<UserPublic> {
  const { email, googleId, username } = input;

  try {
    return await prisma.user.create({
      data: {
        email,
        username,
        googleId,
        provider: "google",
      },
      select: userPublicSelect,
    });
  } catch (error) {
    if (isPrismaErrorCode(error, "P2002"))
      throw new ApiError("AUTH_GOOGLE_USER_INSERT_FAILED");
    throw error;
  }
}

type FailedPasswordAttemptInput = {
  userId: string;
  now: Date;
  maxFailedAttempts: number;
  lockoutDurationMs: number;
};

export type FailedPasswordAttemptResult = {
  failedAttempts: number;
  lockedUntil: Date | null;
  lockoutTriggered: boolean;
};

export async function recordFailedPasswordAttempt(
  input: FailedPasswordAttemptInput,
): Promise<FailedPasswordAttemptResult> {
  const { userId, now, maxFailedAttempts, lockoutDurationMs } = input;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: { failedAttempts: { increment: 1 } },
      select: { failedAttempts: true, lockedUntil: true },
    });

    let lockoutTriggered = false;
    let lockedUntil = updated.lockedUntil;

    const shouldLock =
      updated.failedAttempts >= maxFailedAttempts &&
      (lockedUntil === null || lockedUntil <= now);

    if (shouldLock) {
      const nextLockedUntil = new Date(now.getTime() + lockoutDurationMs);
      const lockResult = await tx.user.updateMany({
        where: {
          id: userId,
          OR: [{ lockedUntil: null }, { lockedUntil: { lte: now } }],
        },
        data: { lockedUntil: nextLockedUntil },
      });

      if (lockResult.count > 0) {
        lockoutTriggered = true;
        lockedUntil = nextLockedUntil;
      } else {
        const latest = await tx.user.findUnique({
          where: { id: userId },
          select: { lockedUntil: true },
        });
        lockedUntil = latest?.lockedUntil ?? lockedUntil;
      }
    }

    return {
      failedAttempts: updated.failedAttempts,
      lockedUntil,
      lockoutTriggered,
    };
  });
}

export async function registerSuccessfulPasswordLogin(
  userId: string,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });
}
