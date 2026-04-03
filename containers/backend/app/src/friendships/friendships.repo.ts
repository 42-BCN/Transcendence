import { prisma } from "@/lib/prisma";
import type { FriendshipPublic } from "@contracts/friendships/friendships.contracts";

type FriendshipRow = {
  id: string;
  user_id_1: string;
  user_id_2: string;
  sender_id: string;
  status: "pending" | "accepted";
  created_at: Date;
  updated_at: Date;
  user1: { username: string };
  user2: { username: string };
};

export type FriendshipPairRow = {
  id: string;
  status: "pending" | "accepted";
  sender_id: string;
};

function toPublic(
  row: FriendshipRow,
  currentUserId: string,
): FriendshipPublic {
  const friendId = row.user_id_1 === currentUserId ? row.user_id_2 : row.user_id_1;
  const friendUsername =
    row.user_id_1 === currentUserId ? row.user2.username : row.user1.username;

  return {
    id: row.id,
    friendUserId: friendId,
    friendUsername,
    status: row.status,
    isSender: row.sender_id === currentUserId,
    created_at: row.created_at,
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
        user_id_1: smaller,
        user_id_2: larger,
      },
    },
    select: {
      id: true,
      status: true,
      sender_id: true,
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
      user_id_1: smaller,
      user_id_2: larger,
      sender_id: senderId,
      status: "pending",
    },
    include: {
      user1: { select: { username: true } },
      user2: { select: { username: true } },
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
      user_id_1: smaller,
      user_id_2: larger,
      status: "pending",
      NOT: { sender_id: currentUserId },
    },
    data: {
      status: "accepted",
      updated_at: new Date(),
    },
  });

  if (updated.count === 0) return null;

  const row = await prisma.friendship.findUnique({
    where: {
      friendships_pair_uniq: {
        user_id_1: smaller,
        user_id_2: larger,
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

export async function listAcceptedFriendships(
  userId: string,
): Promise<FriendshipPublic[]> {
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ user_id_1: userId }, { user_id_2: userId }],
      status: "accepted",
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user1: { select: { username: true } },
      user2: { select: { username: true } },
    },
  });

  return friendships.map((f) => toPublic(f as FriendshipRow, userId));
}

export async function listReceivedRequests(
  userId: string,
): Promise<FriendshipPublic[]> {
  const requests = await prisma.friendship.findMany({
    where: {
      OR: [{ user_id_1: userId }, { user_id_2: userId }],
      status: "pending",
      NOT: {
        sender_id: userId,
      },
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user1: { select: { username: true } },
      user2: { select: { username: true } },
    },
  });

  return requests.map((r) => toPublic(r as FriendshipRow, userId));
}

export async function listSentRequests(
  userId: string,
): Promise<FriendshipPublic[]> {
  const requests = await prisma.friendship.findMany({
    where: {
      OR: [{ user_id_1: userId }, { user_id_2: userId }],
      status: "pending",
      sender_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user1: { select: { username: true } },
      user2: { select: { username: true } },
    },
  });

  return requests.map((r) => toPublic(r as FriendshipRow, userId));
}

export async function findFriendshipRowById(friendshipId: string): Promise<{
  id: string;
  status: "pending" | "accepted";
  sender_id: string;
  user_id_1: string;
  user_id_2: string;
} | null> {
  return prisma.friendship.findUnique({
    where: { id: friendshipId },
    select: {
      id: true,
      status: true,
      sender_id: true,
      user_id_1: true,
      user_id_2: true,
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
  if (friendship.status !== "pending") return false;
  if (friendship.sender_id === receiverId) return false;
  if (
    friendship.user_id_1 !== receiverId &&
    friendship.user_id_2 !== receiverId
  ) {
    return false;
  }

  await prisma.friendship.delete({
    where: { id: friendshipId },
  });

  return true;
}

export async function acceptFriendRequest(
  requestId: string,
  userId: string,
): Promise<FriendshipPublic | null> {
  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
  });

  if (!friendship) return null;
  if (friendship.status !== "pending") return null;
  if (friendship.sender_id === userId) return null;
  if (friendship.user_id_1 !== userId && friendship.user_id_2 !== userId) {
    return null;
  }

  const updated = await prisma.friendship.update({
    where: { id: requestId },
    data: {
      status: "accepted",
      updated_at: new Date(),
    },
    include: {
      user1: { select: { username: true } },
      user2: { select: { username: true } },
    },
  });

  return toPublic(updated as FriendshipRow, userId);
}

export async function findUserById(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return !!user;
}

export async function findUserBrief(
  userId: string,
): Promise<{ id: string; username: string } | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });
}
