import { prisma } from '@/lib/prisma';

export type DirectMessageRow = {
  id: string;
  senderId: string;
  body: string;
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
      createdAt: true,
      sender: {
        select: {
          username: true,
        },
      },
    },
  });
}
