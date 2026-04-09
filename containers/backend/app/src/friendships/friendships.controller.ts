import type { Request, Response } from 'express';

import type {
  GetFriendsListResponse,
  GetFriendshipsResponse,
  GetPendingRequestsResponse,
  GetSentRequestsResponse,
  SendFriendRequestBody,
  SendFriendRequestResponse,
  RespondFriendRequestResponse,
  DeleteFriendshipResponse,
} from '@contracts/friendships/friendships.contracts';
import type {
  RespondFriendRequestBody,
  DeleteFriendshipParam,
} from '@contracts/friendships/friendships.validation';

import {
  getFriendships,
  getFriendsList,
  getPendingRequests,
  getSentRequests,
  sendFriendRequest,
  respondToFriendRequest,
  removeFriendship,
} from './friendships.service';

export async function getFriendsListController(
  req: Request,
  res: Response<GetFriendsListResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const friends = await getFriendsList(userId);
  res.status(200).json({ ok: true, data: { friends } });
}

export async function getFriendshipsController(
  req: Request,
  res: Response<GetFriendshipsResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const friendships = await getFriendships(userId);
  res.status(200).json({ ok: true, data: { friendships } });
}

export async function getPendingRequestsController(
  req: Request,
  res: Response<GetPendingRequestsResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const requests = await getPendingRequests(userId);
  res.status(200).json({ ok: true, data: { requests } });
}

export async function getSentRequestsController(
  req: Request,
  res: Response<GetSentRequestsResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const requests = await getSentRequests(userId);
  res.status(200).json({ ok: true, data: { requests } });
}

export async function sendFriendRequestController(
  req: Request<object, object, SendFriendRequestBody>,
  res: Response<SendFriendRequestResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const { friendship, wasAutoAccepted } = await sendFriendRequest(userId, req.body.targetUserId);
  const status = wasAutoAccepted ? 200 : 201;
  res.status(status).json({
    ok: true,
    data: { friendship, wasAutoAccepted },
  });
}

export async function respondFriendRequestController(
  req: Request<object, object, RespondFriendRequestBody>,
  res: Response<RespondFriendRequestResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const result = await respondToFriendRequest(req.body.friendshipId, userId, req.body.action);
  res.status(200).json({ ok: true, data: result });
}

export async function deleteFriendshipController(
  req: Request<DeleteFriendshipParam>,
  res: Response<DeleteFriendshipResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  await removeFriendship(req.params.friendshipId, userId);
  res.status(200).json({ ok: true, data: { deleted: true } });
}
