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
  friendshipStatus: 'pending' | 'accepted' | null;
  senderId: string | null;
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

export async function searchUsersByUsername(
  query: string,
  limit: number,
  offset: number,
  currentUserId: string,
): Promise<UserSearchRow[]> {
  const sanitized = query.replace(/[%_\\]/g, '\\$&');

  const rows = await prisma.$queryRaw<UserSearchRow[]>`
    SELECT 
      u.id, 
      u.username, 
      u.avatar, 
      f.status as "friendshipStatus", 
      f.sender_id as "senderId"
    FROM users u
    LEFT JOIN friendships f ON (f.user_id_1 = ${currentUserId}::uuid AND f.user_id_2 = u.id) 
                           OR (f.user_id_1 = u.id AND f.user_id_2 = ${currentUserId}::uuid)
    WHERE u.username ILIKE ${'%' + sanitized + '%'}
      AND u.id != ${currentUserId}::uuid
    ORDER BY 
      CASE 
        WHEN f.status = 'accepted' THEN 1
        WHEN f.status = 'pending' THEN 2
        ELSE 3
      END ASC,
      u.username ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return rows;
}

export async function countSearchUsersByUsername(
  query: string,
  currentUserId: string,
): Promise<number> {
  const sanitized = query.replace(/[%_\\]/g, '\\$&');

  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count
    FROM users
    WHERE username ILIKE ${'%' + sanitized + '%'}
      AND id != ${currentUserId}::uuid
  `;

  return Number(result[0].count);
}
