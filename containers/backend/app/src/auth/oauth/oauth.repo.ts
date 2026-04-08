import { ApiError } from '@shared';
import { prisma } from '@/lib/prisma';

import { isPrismaErrorCode, type UserPublic, userPublicSelect } from '../shared.repo';

type OauthUser = UserPublic & { isBlocked: boolean };

const oauthUserSelect = {
  ...userPublicSelect,
  isBlocked: true,
} as const;

export function findUserByGoogleId(googleId: string): Promise<OauthUser | null> {
  return prisma.user.findUnique({
    where: { googleId },
    select: oauthUserSelect,
  });
}

type LinkGoogleIdToEmailUserInput = {
  email: string;
  googleId: string;
};

export async function linkGoogleIdToEmailUser(
  input: LinkGoogleIdToEmailUserInput,
): Promise<OauthUser> {
  const { email, googleId } = input;

  try {
    return await prisma.user.update({
      where: { email },
      data: {
        googleId,
      },
      select: oauthUserSelect,
    });
  } catch (error) {
    if (isPrismaErrorCode(error, 'P2025') || isPrismaErrorCode(error, 'P2002')) {
      throw new ApiError('AUTH_GOOGLE_LINK_FAILED');
    }
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
