import type { Request, Response } from 'express';

import {
  FriendshipInternalNotifyBodySchema,
  FriendshipPresenceCheckBodySchema,
  friendshipSocketEvents,
} from '@contracts/sockets/friendships/friendships.schema';
import {
  emitToUser,
  getUsersOnlineStatus,
  subscribeUserToFriendStatus,
} from '../features/friends.socket';
import { logEvents } from '../socket.logs';

type ZodFlattenableError = {
  flatten: () => unknown;
};

function respondBadRequest(res: Response, error: ZodFlattenableError): void {
  res.status(400).json({
    ok: false,
    errors: error.flatten(),
  });
}

function validateInternalSecret(req: Request, res: Response, event: string): boolean {
  const secret = process.env.SOCKET_INTERNAL_SECRET;

  if (!secret) return true;

  const header = req.headers['x-internal-secret'];

  if (header !== secret) {
    logEvents.warn({ event });
    res.status(401).json({ ok: false });
    return false;
  }

  return true;
}

export function handleInternalNotify(req: Request, res: Response): void {
  if (!validateInternalSecret(req, res, 'internal_notify_unauthorized')) return;

  const parsed = FriendshipInternalNotifyBodySchema.safeParse(req.body);

  if (!parsed.success) {
    logEvents.warn({
      event: 'internal_notify_validation_failed',
      errors: parsed.error.flatten(),
    });
    respondBadRequest(res, parsed.error);
    return;
  }

  const body = parsed.data;

  logEvents.info({
    event: 'internal_notify_received',
    socketEvent: body.event,
    userId: body.userId,
  });

  switch (body.event) {
    case friendshipSocketEvents.request:
      emitToUser(body.userId, body.event, body.payload);
      break;

    case friendshipSocketEvents.accepted:
      emitToUser(body.userId, body.event, body.payload);
      subscribeUserToFriendStatus(body.userId, body.payload.friendUserId);
      break;

    case friendshipSocketEvents.rejected:
      emitToUser(body.userId, body.event, body.payload);
      break;
  }

  res.json({ ok: true });
}

export function handlePresenceCheck(req: Request, res: Response): void {
  if (!validateInternalSecret(req, res, 'internal_presence_unauthorized')) return;

  const parsed = FriendshipPresenceCheckBodySchema.safeParse(req.body);

  if (!parsed.success) {
    logEvents.warn({
      event: 'internal_presence_validation_failed',
      errors: parsed.error.flatten(),
    });
    respondBadRequest(res, parsed.error);
    return;
  }

  const { userIds } = parsed.data;

  logEvents.info({
    event: 'internal_presence_requested',
    userCount: userIds.length,
  });

  const status = getUsersOnlineStatus(userIds);

  res.json({ ok: true, data: { status } });
}
