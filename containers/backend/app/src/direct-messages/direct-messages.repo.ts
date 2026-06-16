import { prisma } from '@/lib/prisma';

export type DirectMessageRow = {
  id: string;
  senderId: string;
  body: string;
  type: 'user' | 'game_invitation';
  readAt: Date | null;
  createdAt: Date;
  gameInvitationRoomId: number | null;
  gameInvitationInvitedUserId: string | null;
  gameInvitationExpiresAt: Date | null;
  gameInvitationAcceptedAt: Date | null;
  sender: {
    username: string;
  };
};

const DIRECT_MESSAGE_SELECT = {
  id: true,
  senderId: true,
  body: true,
  type: true,
  readAt: true,
  createdAt: true,
  gameInvitationRoomId: true,
  gameInvitationInvitedUserId: true,
  gameInvitationExpiresAt: true,
  gameInvitationAcceptedAt: true,
  sender: {
    select: {
      username: true,
    },
  },
} as const;

export async function listDirectMessagesForFriendship(
  friendshipId: string,
): Promise<DirectMessageRow[]> {
  return prisma.directMessage.findMany({
    where: { friendshipId },
    orderBy: { createdAt: 'asc' },
    select: DIRECT_MESSAGE_SELECT,
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
      type: 'user',
    },
    select: DIRECT_MESSAGE_SELECT,
  });
}

export async function createGameInvitationDirectMessage(args: {
  friendshipId: string;
  senderId: string;
  body: string;
  roomId: number;
  invitedUserId: string;
  expiresAt: Date;
}): Promise<DirectMessageRow> {
  return prisma.directMessage.create({
    data: {
      friendshipId: args.friendshipId,
      senderId: args.senderId,
      body: args.body,
      type: 'game_invitation',
      gameInvitationRoomId: args.roomId,
      gameInvitationInvitedUserId: args.invitedUserId,
      gameInvitationExpiresAt: args.expiresAt,
    },
    select: DIRECT_MESSAGE_SELECT,
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

export async function findActivePendingInvitationBetweenUsers(args: {
  senderId: string;
  invitedUserId: string;
  now: Date;
}): Promise<DirectMessageRow | null> {
  return prisma.directMessage.findFirst({
    where: {
      senderId: args.senderId,
      type: 'game_invitation',
      gameInvitationInvitedUserId: args.invitedUserId,
      gameInvitationAcceptedAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: DIRECT_MESSAGE_SELECT,
  });
}

export async function countActivePendingInvitationsSentByUser(args: {
  senderId: string;
  now: Date;
}): Promise<number> {
  return prisma.directMessage.count({
    where: {
      senderId: args.senderId,
      type: 'game_invitation',
      gameInvitationAcceptedAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
  });
}

export async function countRecentGameInvitationsSentByUser(args: {
  senderId: string;
  since: Date;
}): Promise<number> {
  return prisma.directMessage.count({
    where: {
      senderId: args.senderId,
      type: 'game_invitation',
      createdAt: {
        gte: args.since,
      },
    },
  });
}

export async function findGameInvitationById(invitationId: string): Promise<DirectMessageRow | null> {
  return prisma.directMessage.findUnique({
    where: { id: invitationId },
    select: DIRECT_MESSAGE_SELECT,
  });
}

export async function listPendingGameInvitationsForUser(args: {
  invitedUserId: string;
  now: Date;
}): Promise<DirectMessageRow[]> {
  return prisma.directMessage.findMany({
    where: {
      type: 'game_invitation',
      gameInvitationInvitedUserId: args.invitedUserId,
      gameInvitationAcceptedAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: DIRECT_MESSAGE_SELECT,
  });
}

export async function markGameInvitationAccepted(args: {
  invitationId: string;
  acceptedByUserId: string;
  now: Date;
}): Promise<boolean> {
  const updated = await prisma.directMessage.updateMany({
    where: {
      id: args.invitationId,
      type: 'game_invitation',
      gameInvitationInvitedUserId: args.acceptedByUserId,
      gameInvitationAcceptedAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    data: {
      gameInvitationAcceptedAt: args.now,
      gameInvitationAcceptedByUserId: args.acceptedByUserId,
    },
  });

  return updated.count === 1;
}

export async function markReceivedInvitationsAcceptedByRoom(args: {
  invitedUserId: string;
  roomId: number;
  now: Date;
}): Promise<string[]> {
  const rows = await prisma.directMessage.findMany({
    where: {
      gameInvitationInvitedUserId: args.invitedUserId,
      type: 'game_invitation',
      gameInvitationRoomId: args.roomId,
      gameInvitationAcceptedAt: null,
      gameInvitationExpiresAt: { gt: args.now },
    },
    select: { id: true, senderId: true },
  });

  if (rows.length === 0) return [];

  await prisma.directMessage.updateMany({
    where: { id: { in: rows.map((r) => r.id) } },
    data: {
      gameInvitationAcceptedAt: args.now,
      gameInvitationAcceptedByUserId: args.invitedUserId,
    },
  });

  return rows.map((r) => r.senderId);
}

export async function listReceivedInvitationsByRoom(args: {
  invitedUserId: string;
  roomId: number;
  now: Date;
}): Promise<ReceivedInvitationRow[]> {
  const rows = await prisma.directMessage.findMany({
    where: {
      gameInvitationInvitedUserId: args.invitedUserId,
      type: 'game_invitation',
      gameInvitationRoomId: args.roomId,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      senderId: true,
      createdAt: true,
      gameInvitationAcceptedAt: true,
      gameInvitationExpiresAt: true,
      sender: { select: { username: true } },
    },
  });

  const seen = new Set<string>();
  const deduped: ReceivedInvitationRow[] = [];

  for (const r of rows) {
    if (r.gameInvitationExpiresAt === null) continue;
    if (seen.has(r.senderId)) continue;
    seen.add(r.senderId);
    deduped.push({
      id: r.id,
      senderUserId: r.senderId,
      senderUsername: r.sender.username,
      acceptedAt: r.gameInvitationAcceptedAt,
      expiresAt: r.gameInvitationExpiresAt,
      createdAt: r.createdAt,
    });
  }

  return deduped;
}

export async function listPendingInviteesForSender(args: {
  senderId: string;
  now: Date;
}): Promise<string[]> {
  const rows = await prisma.directMessage.findMany({
    where: {
      senderId: args.senderId,
      type: 'game_invitation',
      gameInvitationAcceptedAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    select: {
      gameInvitationInvitedUserId: true,
    },
  });

  return rows
    .map((r) => r.gameInvitationInvitedUserId)
    .filter((id): id is string => id !== null);
}

export type SentInvitationRow = {
  id: string;
  invitedUserId: string;
  invitedUsername: string;
  acceptedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
};

export type ReceivedInvitationRow = {
  id: string;
  senderUserId: string;
  senderUsername: string;
  acceptedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
};

export async function listSentInvitationsByRoom(args: {
  senderId: string;
  roomId: number;
  now: Date;
}): Promise<SentInvitationRow[]> {
  const rows = await prisma.directMessage.findMany({
    where: {
      senderId: args.senderId,
      type: 'game_invitation',
      gameInvitationRoomId: args.roomId,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      gameInvitationInvitedUserId: true,
      gameInvitationAcceptedAt: true,
      gameInvitationExpiresAt: true,
    },
  });

  const invitedUserIds = rows
    .map((r) => r.gameInvitationInvitedUserId)
    .filter((id): id is string => id !== null);

  if (invitedUserIds.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: invitedUserIds } },
    select: { id: true, username: true },
  });

  const usernameById = new Map(users.map((u) => [u.id, u.username]));

  const seen = new Set<string>();
  const deduped: SentInvitationRow[] = [];

  for (const r of rows) {
    if (r.gameInvitationInvitedUserId === null || r.gameInvitationExpiresAt === null) continue;
    if (seen.has(r.gameInvitationInvitedUserId)) continue;
    seen.add(r.gameInvitationInvitedUserId);
    deduped.push({
      id: r.id,
      invitedUserId: r.gameInvitationInvitedUserId,
      invitedUsername: usernameById.get(r.gameInvitationInvitedUserId) ?? r.gameInvitationInvitedUserId,
      acceptedAt: r.gameInvitationAcceptedAt,
      expiresAt: r.gameInvitationExpiresAt,
      createdAt: r.createdAt,
    });
  }

  return deduped;
}
