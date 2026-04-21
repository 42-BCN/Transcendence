import { prisma } from '@/lib/prisma';

import type { AuthUserRow } from './auth.model';

export type UserPublic = Pick<AuthUserRow, 'id' | 'email' | 'username'>;
export type UserVerification = Pick<AuthUserRow, 'id' | 'email' | 'username' | 'emailVerifiedAt'>;
export type UserWithPassword = Pick<
  AuthUserRow,
  | 'id'
  | 'email'
  | 'username'
  | 'passwordHash'
  | 'provider'
  | 'isBlocked'
  | 'failedAttempts'
  | 'lockedUntil'
  | 'emailVerifiedAt'
>;

export const userPublicSelect = {
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
  provider: true,
  isBlocked: true,
  failedAttempts: true,
  lockedUntil: true,
  emailVerifiedAt: true,
} as const;

export const tokenTargetUserSelect = {
  id: true,
  email: true,
  username: true,
  isBlocked: true,
} as const;

export function isPrismaErrorCode(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

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

export function findUserByIdWithPassword(id: string): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { id },
    select: userWithPasswordSelect,
  });
}

export function findUserByIdForVerification(id: string): Promise<UserVerification | null> {
  return prisma.user.findUnique({
    where: { id },
    select: userVerificationSelect,
  });
}
