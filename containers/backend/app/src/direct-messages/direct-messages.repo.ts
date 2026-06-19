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
  gameInvitationCancelledAt: Date | null;
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
  gameInvitationCancelledAt: true,
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
      gameInvitationCancelledAt: null,
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
      gameInvitationCancelledAt: null,
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
      gameInvitationCancelledAt: null,
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
      gameInvitationCancelledAt: null,
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

export async function markGameInvitationCancelled(args: {
  invitationId: string;
  cancelledByUserId: string;
  now: Date;
}): Promise<boolean> {
  const updated = await prisma.directMessage.updateMany({
    where: {
      id: args.invitationId,
      type: 'game_invitation',
      gameInvitationInvitedUserId: args.cancelledByUserId,
      gameInvitationAcceptedAt: null,
      gameInvitationCancelledAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    data: {
      gameInvitationCancelledAt: args.now,
      gameInvitationCancelledByUserId: args.cancelledByUserId,
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
      gameInvitationCancelledAt: null,
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

export type InvitationForStateRow = {
  id: string;
  senderId: string;
  senderUsername: string;
  invitedUserId: string;
  invitedUsername: string;
  roomId: number;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
  cancelledAt: Date | null;
};

export async function listInvitationsForUserState(args: {
  userId: string;
}): Promise<InvitationForStateRow[]> {
  const rows = await prisma.directMessage.findMany({
    where: {
      type: 'game_invitation',
      gameInvitationRoomId: { not: null },
      gameInvitationInvitedUserId: { not: null },
      gameInvitationExpiresAt: { not: null },
      OR: [
        { senderId: args.userId },
        { gameInvitationInvitedUserId: args.userId },
      ],
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      senderId: true,
      createdAt: true,
      gameInvitationInvitedUserId: true,
      gameInvitationRoomId: true,
      gameInvitationExpiresAt: true,
      gameInvitationAcceptedAt: true,
      gameInvitationCancelledAt: true,
      sender: { select: { username: true } },
    },
  });

  const invitedUserIds = [...new Set(
    rows
      .map((r) => r.gameInvitationInvitedUserId)
      .filter((id): id is string => id !== null),
  )];

  const invitedUsers = invitedUserIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: invitedUserIds } },
        select: { id: true, username: true },
      })
    : [];

  const usernameById = new Map(invitedUsers.map((u) => [u.id, u.username]));

  return rows
    .filter(
      (r): r is typeof r & {
        gameInvitationInvitedUserId: string;
        gameInvitationRoomId: number;
        gameInvitationExpiresAt: Date;
      } =>
        r.gameInvitationInvitedUserId !== null &&
        r.gameInvitationRoomId !== null &&
        r.gameInvitationExpiresAt !== null,
    )
    .map((r) => ({
      id: r.id,
      senderId: r.senderId,
      senderUsername: r.sender.username,
      invitedUserId: r.gameInvitationInvitedUserId,
      invitedUsername: usernameById.get(r.gameInvitationInvitedUserId) ?? r.gameInvitationInvitedUserId,
      roomId: r.gameInvitationRoomId,
      createdAt: r.createdAt,
      expiresAt: r.gameInvitationExpiresAt,
      acceptedAt: r.gameInvitationAcceptedAt,
      cancelledAt: r.gameInvitationCancelledAt,
    }));
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
      gameInvitationCancelledAt: null,
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

export async function listPendingInvitationSendersForInvitee(args: {
  invitedUserId: string;
  now: Date;
}): Promise<string[]> {
  const rows = await prisma.directMessage.findMany({
    where: {
      type: 'game_invitation',
      gameInvitationInvitedUserId: args.invitedUserId,
      gameInvitationAcceptedAt: null,
      gameInvitationCancelledAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    select: {
      senderId: true,
    },
  });

  return rows.map((row) => row.senderId);
}

export async function cancelPendingInvitationsByRoom(args: {
  roomId: number;
  now: Date;
}): Promise<Array<{ senderId: string; invitedUserId: string }>> {
  const rows = await prisma.directMessage.findMany({
    where: {
      type: 'game_invitation',
      gameInvitationRoomId: args.roomId,
      gameInvitationInvitedUserId: { not: null },
      gameInvitationAcceptedAt: null,
      gameInvitationCancelledAt: null,
      gameInvitationExpiresAt: {
        gt: args.now,
      },
    },
    select: {
      id: true,
      senderId: true,
      gameInvitationInvitedUserId: true,
    },
  });

  const cancellableRows = rows.filter(
    (row): row is typeof row & { gameInvitationInvitedUserId: string } =>
      row.gameInvitationInvitedUserId !== null,
  );

  if (cancellableRows.length === 0) {
    return [];
  }

  await prisma.directMessage.updateMany({
    where: {
      id: { in: cancellableRows.map((row) => row.id) },
    },
    data: {
      gameInvitationCancelledAt: args.now,
    },
  });

  return cancellableRows.map((row) => ({
    senderId: row.senderId,
    invitedUserId: row.gameInvitationInvitedUserId,
  }));
}
