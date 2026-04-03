import type { Request, Response } from "express";
import type {
  GetFriendshipsResponse,
  GetReceivedRequestsResponse,
  GetSentRequestsResponse,
  SendFriendRequestBody,
  SendFriendRequestResponse,
  AcceptRequestResponse,
} from "@contracts/friendships/friendships.contracts";
import type { AcceptRequestParam } from "@contracts/friendships/friendships.validation";

import {
  getFriendships,
  getReceivedRequests,
  getSentRequests,
  sendFriendRequest,
  acceptRequest,
} from "./friendships.service";

export async function getFriendshipsController(
  req: Request,
  res: Response<GetFriendshipsResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const friendships = await getFriendships(userId);
  res.status(200).json({ ok: true, data: { friendships } });
}

export async function getReceivedRequestsController(
  req: Request,
  res: Response<GetReceivedRequestsResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const requests = await getReceivedRequests(userId);
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
  const friendship = await sendFriendRequest(userId, req.body.targetUserId);
  res.status(201).json({ ok: true, data: { friendship } });
}

export async function acceptRequestController(
  req: Request<AcceptRequestParam>,
  res: Response<AcceptRequestResponse>,
): Promise<void> {
  const userId = req.session.userId!;
  const friendship = await acceptRequest(req.params.requestId, userId);
  res.status(200).json({ ok: true, data: { friendship } });
}
