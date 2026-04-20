import type { UserPublic } from '@contracts/users/users.contracts';
import { prisma } from '@/lib/prisma';

type UserPublicRow = {
  id: string;
  username: string;
};

function mapUserRow(row: UserPublicRow): UserPublic {
  return {
    id: row.id,
    username: row.username,
  };
}

const userPublicSelect = {
  id: true,
  username: true,
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

export async function searchUsersByUsername(query: string, limit: number): Promise<UserPublic[]> {
  const rows = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: userPublicSelect,
    take: limit,
  });

  return rows.map(mapUserRow);
}
