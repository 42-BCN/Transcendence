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
