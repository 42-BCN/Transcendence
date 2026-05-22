import { prisma } from '@/lib/prisma';

export type DirectMessageRow = {
  id: string;
  senderId: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
  sender: {
    username: string;
  };
};

export async function listDirectMessagesForFriendship(
  friendshipId: string,
): Promise<DirectMessageRow[]> {
  return prisma.directMessage.findMany({
    where: { friendshipId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      senderId: true,
      body: true,
      readAt: true,
      createdAt: true,
      sender: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function createDirectMessage(args: {
  friendshipId: string;
  senderId: string;
  body: string;
}): Promise<DirectMessageRow> {
  return prisma.directMessage.create({
    data: {
      friendshipId: args.friendshipId,
      senderId: args.senderId,
      body: args.body,
    },
    select: {
      id: true,
      senderId: true,
      body: true,
      readAt: true,
      createdAt: true,
      sender: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function countUnreadDirectMessagesForFriendship(args: {
  friendshipId: string;
  userId: string;
}): Promise<number> {
  return prisma.directMessage.count({
    where: {
      friendshipId: args.friendshipId,
      senderId: { not: args.userId },
      readAt: null,
    },
  });
}

export async function countUnreadDirectMessagesByFriendshipIds(args: {
  friendshipIds: string[];
  userId: string;
}): Promise<Map<string, number>> {
  if (args.friendshipIds.length === 0) return new Map();

  const groupedCounts = await prisma.directMessage.groupBy({
    by: ['friendshipId'],
    where: {
      friendshipId: { in: args.friendshipIds },
      senderId: { not: args.userId },
      readAt: null,
    },
    _count: {
      _all: true,
    },
  });

  return new Map(
    groupedCounts.map((row) => [row.friendshipId, row._count._all] as const),
  );
}

export async function markDirectMessagesAsRead(args: {
  friendshipId: string;
  userId: string;
}): Promise<number> {
  await prisma.directMessage.updateMany({
    where: {
      friendshipId: args.friendshipId,
      senderId: { not: args.userId },
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return countUnreadDirectMessagesForFriendship(args);
}
