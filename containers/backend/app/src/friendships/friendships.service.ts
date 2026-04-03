import { ApiError } from "@shared";
import type { FriendshipPublic } from "@contracts/friendships/friendships.contracts";

import {
  findExistingFriendship,
  createFriendRequest,
  listAcceptedFriendships,
  listReceivedRequests,
  listSentRequests,
  acceptFriendRequest,
  findUserById,
} from "./friendships.repo";

export async function sendFriendRequest(
  senderId: string,
  targetId: string,
): Promise<FriendshipPublic> {
  if (senderId === targetId) throw new ApiError("CANNOT_FRIEND_YOURSELF");

  const targetExists = await findUserById(targetId);
  if (!targetExists) throw new ApiError("TARGET_USER_NOT_FOUND");

  const exists = await findExistingFriendship(senderId, targetId);
  if (exists) throw new ApiError("FRIENDSHIP_ALREADY_EXISTS");

  return await createFriendRequest(senderId, targetId);
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
