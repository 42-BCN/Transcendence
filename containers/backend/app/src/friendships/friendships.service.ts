import { ApiError } from "@shared";
import type { FriendshipPublic } from "@contracts/friendships/friendships.contracts";

import {
  findFriendshipByPair,
  createFriendRequest,
  listAcceptedFriendships,
  listReceivedRequests,
  listSentRequests,
  acceptFriendRequest,
  findUserById,
  autoAcceptMutualRequest,
  findUserBrief,
} from "./friendships.repo";
import { notifyFriendAccepted, notifyFriendRequest } from "./friendships.notify";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  );
}

export async function sendFriendRequest(
  senderId: string,
  targetId: string,
): Promise<{ friendship: FriendshipPublic; wasAutoAccepted: boolean }> {
  if (senderId === targetId) throw new ApiError("FRIENDSHIP_SELF_REQUEST");

  const targetExists = await findUserById(targetId);
  if (!targetExists) throw new ApiError("USER_NOT_FOUND");

  const existing = await findFriendshipByPair(senderId, targetId);

  if (existing) {
    if (existing.status === "accepted") {
      throw new ApiError("FRIENDSHIP_ALREADY_EXISTS");
    }
    if (existing.sender_id === senderId) {
      throw new ApiError("FRIENDSHIP_REQUEST_ALREADY_SENT");
    }

    const accepted = await autoAcceptMutualRequest(senderId, targetId);
    if (!accepted) throw new ApiError("INTERNAL_ERROR");

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
    if (!afterRace) throw new ApiError("INTERNAL_ERROR");

    if (afterRace.status === "accepted") {
      throw new ApiError("FRIENDSHIP_ALREADY_EXISTS");
    }
    if (afterRace.sender_id === senderId) {
      throw new ApiError("FRIENDSHIP_REQUEST_ALREADY_SENT");
    }

    const accepted = await autoAcceptMutualRequest(senderId, targetId);
    if (!accepted) throw new ApiError("INTERNAL_ERROR");

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

export async function getFriendships(
  userId: string,
): Promise<FriendshipPublic[]> {
  return await listAcceptedFriendships(userId);
}

export async function getReceivedRequests(
  userId: string,
): Promise<FriendshipPublic[]> {
  return await listReceivedRequests(userId);
}

export async function getSentRequests(
  userId: string,
): Promise<FriendshipPublic[]> {
  return await listSentRequests(userId);
}

export async function acceptRequest(
  requestId: string,
  userId: string,
): Promise<FriendshipPublic> {
  const friendship = await acceptFriendRequest(requestId, userId);
  if (!friendship) throw new ApiError("FRIENDSHIP_REQUEST_NOT_FOUND");
  return friendship;
}
