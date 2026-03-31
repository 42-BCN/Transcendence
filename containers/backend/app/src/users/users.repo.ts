import type { UserPublic } from "@contracts/users/users.contract";
import { prisma } from "@/lib/prisma";

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

export async function listUsers(
  limit: number,
  offset: number,
): Promise<UserPublic[]> {
  const rows = await prisma.user.findMany({
    orderBy: {
      created_at: "desc",
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
