import { ApiError } from '@shared';
import type { FriendshipPublic, FriendPublic } from '@contracts/friendships/friendships.contracts';

import {
  findFriendshipByPair,
  createFriendRequest,
  listAcceptedFriendships,
  listFriendsForUser,
  listPendingRequests,
  listSentRequests,
  acceptFriendRequest,
  findUserById,
  autoAcceptMutualRequest,
  findUserBrief,
  findFriendshipRowById,
  rejectFriendRequest,
} from './friendships.repo';
import {
  notifyFriendAccepted,
  notifyFriendRequest,
  notifyFriendRejected,
} from './friendships.notify';
import { resolveOnlineStatus } from './friendships.presence';

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002'
  );
}

export async function sendFriendRequest(
  senderId: string,
  targetId: string,
): Promise<{ friendship: FriendshipPublic; wasAutoAccepted: boolean }> {
  if (senderId === targetId) throw new ApiError('FRIENDSHIP_SELF_REQUEST');

  const targetExists = await findUserById(targetId);
  if (!targetExists) throw new ApiError('USER_NOT_FOUND');

  const existing = await findFriendshipByPair(senderId, targetId);

  if (existing) {
    if (existing.status === 'accepted') {
      throw new ApiError('FRIENDSHIP_ALREADY_EXISTS');
    }
    if (existing.senderId === senderId) {
      throw new ApiError('FRIENDSHIP_REQUEST_ALREADY_SENT');
    }

    const accepted = await autoAcceptMutualRequest(senderId, targetId);
    if (!accepted) throw new ApiError('INTERNAL_ERROR');

    const senderBrief = await findUserBrief(senderId);
    const targetBrief = await findUserBrief(targetId);
    if (senderBrief && targetBrief) {
      await notifyFriendAccepted(
        { userId: senderId, username: senderBrief.username },
        { userId: targetId, username: targetBrief.username },
      );
    }

    return { friendship: accepted, wasAutoAccepted: true };
  }

  try {
    const friendship = await createFriendRequest(senderId, targetId);
    const senderBrief = await findUserBrief(senderId);
    if (senderBrief) {
      await notifyFriendRequest(targetId, {
        senderId,
        senderUsername: senderBrief.username,
        friendshipId: friendship.id,
      });
    }
    return { friendship, wasAutoAccepted: false };
  } catch (err) {
    if (!isUniqueViolation(err)) throw err;

    const afterRace = await findFriendshipByPair(senderId, targetId);
    if (!afterRace) throw new ApiError('INTERNAL_ERROR');

    if (afterRace.status === 'accepted') {
      throw new ApiError('FRIENDSHIP_ALREADY_EXISTS');
    }
    if (afterRace.senderId === senderId) {
      throw new ApiError('FRIENDSHIP_REQUEST_ALREADY_SENT');
    }

    const accepted = await autoAcceptMutualRequest(senderId, targetId);
    if (!accepted) throw new ApiError('INTERNAL_ERROR');

    const senderBrief = await findUserBrief(senderId);
    const targetBrief = await findUserBrief(targetId);
    if (senderBrief && targetBrief) {
      await notifyFriendAccepted(
        { userId: senderId, username: senderBrief.username },
        { userId: targetId, username: targetBrief.username },
      );
    }

    return { friendship: accepted, wasAutoAccepted: true };
  }
}

export async function getFriendships(userId: string): Promise<FriendshipPublic[]> {
  return await listAcceptedFriendships(userId);
}

export async function getFriendsList(userId: string): Promise<FriendPublic[]> {
  const friends = await listFriendsForUser(userId);
  if (friends.length === 0) return [];

  const friendIds = friends.map((f) => f.id);
  const onlineStatus = await resolveOnlineStatus(friendIds);

  return friends.map((f) => ({
    id: f.id,
    username: f.username,
    avatar: f.avatar,
    isOnline: onlineStatus[f.id] ?? false,
  }));
}

export async function getPendingRequests(userId: string): Promise<FriendshipPublic[]> {
  return await listPendingRequests(userId);
}

export async function getSentRequests(userId: string): Promise<FriendshipPublic[]> {
  return await listSentRequests(userId);
}

export async function respondToFriendRequest(
  friendshipId: string,
  currentUserId: string,
  action: 'accept' | 'reject',
): Promise<{ friendship?: FriendshipPublic; action: 'accept' | 'reject' }> {
  const row = await findFriendshipRowById(friendshipId);
  if (!row) throw new ApiError('FRIENDSHIP_REQUEST_NOT_FOUND');

  const inPair = row.userId1 === currentUserId || row.userId2 === currentUserId;
  if (!inPair) throw new ApiError('FRIENDSHIP_REQUEST_NOT_FOUND');

  if (row.status === 'accepted') {
    throw new ApiError('FRIENDSHIP_ALREADY_ACCEPTED');
  }
  if (row.status !== 'pending') {
    throw new ApiError('FRIENDSHIP_ALREADY_ACCEPTED');
  }
  if (row.senderId === currentUserId) {
    throw new ApiError('UNAUTHORIZED_ACTION');
  }

  if (action === 'accept') {
    const friendship = await acceptFriendRequest(friendshipId, currentUserId);
    if (!friendship) throw new ApiError('INTERNAL_ERROR');

    const receiverBrief = await findUserBrief(currentUserId);
    const senderBrief = await findUserBrief(row.senderId);
    if (receiverBrief && senderBrief) {
      await notifyFriendAccepted(
        { userId: currentUserId, username: receiverBrief.username },
        { userId: row.senderId, username: senderBrief.username },
      );
    }

    return { friendship, action: 'accept' };
  }

  const deleted = await rejectFriendRequest(friendshipId, currentUserId);
  if (!deleted) throw new ApiError('INTERNAL_ERROR');

  await notifyFriendRejected(row.senderId, {
    rejectedByUserId: currentUserId,
    friendshipId,
  });

  return { action: 'reject' };
}
