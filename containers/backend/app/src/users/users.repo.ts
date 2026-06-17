import type { UserMeProfile, UserPublic } from '@contracts/users/users.contracts';
import { prisma } from '@/lib/prisma';

type UserPublicRow = {
  id: string;
  username: string;
  avatar: string | null;
  bio: string;
};

type UserMeProfileRow = UserPublicRow & {
  email: string;
  provider: 'local' | 'google';
};

type UserSearchRow = {
  id: string;
  username: string;
  avatar: string | null;
};

function mapUserRow(row: UserPublicRow): UserPublic {
  return {
    id: row.id,
    username: row.username,
    avatar: row.avatar,
    bio: row.bio,
  };
}

function mapUserMeProfileRow(row: UserMeProfileRow): UserMeProfile {
  return {
    ...mapUserRow(row),
    email: row.email,
    provider: row.provider,
  };
}

const userPublicSelect = {
  id: true,
  username: true,
  avatar: true,
  bio: true,
} as const;

const userMeProfileSelect = {
  ...userPublicSelect,
  email: true,
  provider: true,
} as const;

export async function listUsers(limit: number, offset: number): Promise<UserPublic[]> {
  const rows = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
    select: userPublicSelect,
  });

  return rows.map(mapUserRow);
}

export async function countUsers(): Promise<number> {
  return prisma.user.count();
}

export async function selectUserData(id: string): Promise<UserPublic | null> {
  const row = await prisma.user.findUnique({
    where: { id },
    select: userPublicSelect,
  });

  return row ? mapUserRow(row) : null;
}

export async function selectUserDataByUsername(username: string): Promise<UserPublic | null> {
  const row = await prisma.user.findUnique({
    where: { username },
    select: userPublicSelect,
  });

  return row ? mapUserRow(row) : null;
}

export async function selectUserMeProfileData(id: string): Promise<UserMeProfile | null> {
  const row = await prisma.user.findUnique({
    where: { id },
    select: userMeProfileSelect,
  });

  return row ? mapUserMeProfileRow(row) : null;
}

export async function updateUserProfile(id: string, bio: string, avatar: string | null): Promise<UserMeProfile | null> {
  const result = await prisma.user.updateMany({
    where: { id },
    data: { bio, avatar },
  });

  if (result.count === 0) return null;

  const row = await prisma.user.findUnique({
    where: { id },
    select: userMeProfileSelect,
  });

  return row ? mapUserMeProfileRow(row) : null;
}

export async function deleteUserById(id: string): Promise<boolean> {
  const result = await prisma.user.deleteMany({
    where: { id },
  });

  return result.count > 0;
}

export async function searchUsersByUsername(
  query: string,
  limit: number,
  currentUserId: string,
): Promise<UserSearchRow[]> {
  const sanitized = query.replace(/[%_\\]/g, '\\$&');

  const rows = await prisma.$queryRaw<UserSearchRow[]>`
    SELECT id, username, avatar
    FROM users
    WHERE username ILIKE ${'%' + sanitized + '%'}
      AND id != ${currentUserId}::uuid
    ORDER BY
      CASE WHEN username ILIKE ${sanitized} THEN 0 ELSE 1 END,
      username ASC
    LIMIT ${limit}
  `;

  return rows;
}

export async function searchPublicUsersByUsername(
  query: string,
  limit: number,
): Promise<UserPublic[]> {
  const rows = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: {
      username: 'asc',
    },
    take: limit,
    select: userPublicSelect,
  });

  return rows.map(mapUserRow);
}
