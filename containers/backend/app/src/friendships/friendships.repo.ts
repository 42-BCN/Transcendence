import { prisma } from '@/lib/prisma';
import type { FriendshipPublic } from '@contracts/friendships/friendships.contracts';

type FriendshipRow = {
  id: string;
  userId1: string;
  userId2: string;
  senderId: string;
  status: 'pending' | 'accepted';
  createdAt: Date;
  updatedAt: Date;
  user1: { username: string; avatar: string | null };
  user2: { username: string; avatar: string | null };
};

export type FriendshipPairRow = {
  id: string;
  status: 'pending' | 'accepted';
  senderId: string;
};

function toPublic(row: FriendshipRow, currentUserId: string): FriendshipPublic {
  const friendId = row.userId1 === currentUserId ? row.userId2 : row.userId1;
  const friendUsername = row.userId1 === currentUserId ? row.user2.username : row.user1.username;
  const friendAvatar = row.userId1 === currentUserId ? row.user2.avatar : row.user1.avatar;

  return {
    id: row.id,
    friendUserId: friendId,
    friendUsername,
    friendAvatar,
    status: row.status,
    isSender: row.senderId === currentUserId,
    createdAt: row.createdAt,
  };
}

function sortedPair(userId1: string, userId2: string): [string, string] {
  return userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
}

export async function findFriendshipByPair(
  userId1: string,
  userId2: string,
): Promise<FriendshipPairRow | null> {
  const [smaller, larger] = sortedPair(userId1, userId2);

  const friendship = await prisma.friendship.findUnique({
    where: {
      friendships_pair_uniq: {
        userId1: smaller,
        userId2: larger,
      },
    },
    select: {
      id: true,
      status: true,
      senderId: true,
    },
  });

  return friendship;
}

export async function createFriendRequest(
  senderId: string,
  targetId: string,
): Promise<FriendshipPublic> {
  const smaller = senderId < targetId ? senderId : targetId;
  const larger = senderId < targetId ? targetId : senderId;

  const friendship = await prisma.friendship.create({
    data: {
      userId1: smaller,
      userId2: larger,
      senderId,
      status: 'pending',
    },
    include: {
      user1: { select: { username: true, avatar: true } },
      user2: { select: { username: true, avatar: true } },
    },
  });

  return toPublic(friendship as FriendshipRow, senderId);
}

/** Pending row must exist with a different sender; upgrades to accepted. */
export async function autoAcceptMutualRequest(
  currentUserId: string,
  targetId: string,
): Promise<FriendshipPublic | null> {
  const [smaller, larger] = sortedPair(currentUserId, targetId);

  const updated = await prisma.friendship.updateMany({
    where: {
      userId1: smaller,
      userId2: larger,
      status: 'pending',
      NOT: { senderId: currentUserId },
    },
    data: {
      status: 'accepted',
      updatedAt: new Date(),
    },
  });

  if (updated.count === 0) return null;

  const row = await prisma.friendship.findUnique({
    where: {
      friendships_pair_uniq: {
        userId1: smaller,
        userId2: larger,
      },
    },
    include: {
      user1: { select: { username: true } },
      user2: { select: { username: true } },
    },
  });

  if (!row) return null;
  return toPublic(row as FriendshipRow, currentUserId);
}

export async function listFriendsForUser(
  userId: string,
): Promise<{ id: string; username: string; avatar: string | null }[]> {
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
      status: 'accepted',
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user1: { select: { id: true, username: true, avatar: true } },
      user2: { select: { id: true, username: true, avatar: true } },
    },
  });

  return friendships.map((f) => {
    const friend = f.userId1 === userId ? f.user2 : f.user1;
    return {
      id: friend.id,
      username: friend.username,
      avatar: friend.avatar,
    };
  });
}

export async function listAcceptedFriendships(userId: string): Promise<FriendshipPublic[]> {
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
      status: 'accepted',
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user1: { select: { username: true, avatar: true } },
      user2: { select: { username: true, avatar: true } },
    },
  });

  return friendships.map((f) => toPublic(f as FriendshipRow, userId));
}

export async function listPendingRequests(userId: string): Promise<FriendshipPublic[]> {
  const requests = await prisma.friendship.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
      status: 'pending',
      NOT: {
        senderId: userId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user1: { select: { username: true, avatar: true } },
      user2: { select: { username: true, avatar: true } },
    },
  });

  return requests.map((r) => toPublic(r as FriendshipRow, userId));
}

export async function listSentRequests(userId: string): Promise<FriendshipPublic[]> {
  const requests = await prisma.friendship.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
      status: 'pending',
      senderId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user1: { select: { username: true, avatar: true } },
      user2: { select: { username: true, avatar: true } },
    },
  });

  return requests.map((r) => toPublic(r as FriendshipRow, userId));
}

export async function findFriendshipRowById(friendshipId: string): Promise<{
  id: string;
  status: 'pending' | 'accepted';
  senderId: string;
  userId1: string;
  userId2: string;
} | null> {
  return prisma.friendship.findUnique({
    where: { id: friendshipId },
    select: {
      id: true,
      status: true,
      senderId: true,
      userId1: true,
      userId2: true,
    },
  });
}

export async function rejectFriendRequest(
  friendshipId: string,
  receiverId: string,
): Promise<boolean> {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) return false;
  if (friendship.status !== 'pending') return false;
  if (friendship.senderId === receiverId) return false;
  if (friendship.userId1 !== receiverId && friendship.userId2 !== receiverId) {
    return false;
  }

  await prisma.friendship.delete({
    where: { id: friendshipId },
  });

  return true;
}

/** Delete any friendship row (pending or accepted) if the user is one of the two members. */
export async function deleteFriendship(
  friendshipId: string,
  currentUserId: string,
): Promise<'deleted' | 'not_found' | 'forbidden'> {
  return prisma.$transaction(async (tx) => {
    const friendship = await tx.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) return 'not_found' as const;

    const isMember =
      friendship.userId1 === currentUserId || friendship.userId2 === currentUserId;
    if (!isMember) return 'forbidden' as const;

    await tx.friendship.delete({ where: { id: friendshipId } });
    return 'deleted' as const;
  });
}

export async function acceptFriendRequest(
  requestId: string,
  userId: string,
): Promise<FriendshipPublic | null> {
  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
  });

  if (!friendship) return null;
  if (friendship.status !== 'pending') return null;
  if (friendship.senderId === userId) return null;
  if (friendship.userId1 !== userId && friendship.userId2 !== userId) {
    return null;
  }

  const updated = await prisma.friendship.update({
    where: { id: requestId },
    data: {
      status: 'accepted',
      updatedAt: new Date(),
    },
    include: {
      user1: { select: { username: true, avatar: true } },
      user2: { select: { username: true, avatar: true } },
    },
  });

  return toPublic(updated as FriendshipRow, userId);
}

/**
 * Batch lookup: returns a Map<otherUserId, {id, status, senderId}> for
 * all friendships between currentUserId and each of otherUserIds.
 * Used by the user search endpoint to inject friendship context in O(1).
 */
export async function findFriendshipsByUserPairs(
  currentUserId: string,
  otherUserIds: string[],
): Promise<Map<string, { id: string; status: 'pending' | 'accepted'; senderId: string }>> {
  if (otherUserIds.length === 0) return new Map();

  const rows = await prisma.friendship.findMany({
    where: {
      OR: otherUserIds.map((otherId) => {
        const [u1, u2] = currentUserId < otherId ? [currentUserId, otherId] : [otherId, currentUserId];
        return { userId1: u1, userId2: u2 };
      }),
    },
    select: {
      id: true,
      userId1: true,
      userId2: true,
      status: true,
      senderId: true,
    },
  });

  const map = new Map<string, { id: string; status: 'pending' | 'accepted'; senderId: string }>();
  for (const row of rows) {
    const otherId = row.userId1 === currentUserId ? row.userId2 : row.userId1;
    map.set(otherId, { id: row.id, status: row.status, senderId: row.senderId });
  }

  return map;
}

export async function findUserById(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return Boolean(user);
}

export async function findUserBrief(
  userId: string,
): Promise<{ id: string; username: string } | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });
}
