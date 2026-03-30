import { ApiError } from "@shared";
import { prisma } from "@/lib/prisma";

import type { AuthUserRow } from "./auth.model";

type UserPublic = Pick<AuthUserRow, "id" | "email" | "username">;
type UserWithPassword = Pick<
  AuthUserRow,
  "id" | "email" | "username" | "password_hash"
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
  password_hash: true,
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
    where: { google_id: googleId },
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
        password_hash: passwordHash,
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
        google_id: googleId,
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
        google_id: googleId,
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
