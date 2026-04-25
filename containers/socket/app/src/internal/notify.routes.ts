import type { Request, Response } from 'express';

import {
  FriendshipInternalNotifyBodySchema,
  FriendshipPresenceCheckBodySchema,
  friendshipSocketEvents,
} from '@contracts/sockets/friendships/friendships.schema';
import { emitToUser, getUsersOnlineStatus } from '../features/friends.socket';
import { logEvents } from '../socket.logs';

function respondBadRequest(res: Response, error: { flatten: () => unknown }): void {
  res.status(400).json({
    ok: false,
    errors: error.flatten(),
  });
}

export function handleInternalNotify(req: Request, res: Response): void {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  if (secret) {
    const header = req.headers['x-internal-secret'];
    if (header !== secret) {
      logEvents.warn({
        event: 'internal_notify_unauthorized',
      });
      res.status(401).json({ ok: false });
      return;
    }
  }

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
      break;
    case friendshipSocketEvents.rejected:
      emitToUser(body.userId, body.event, body.payload);
      break;
  }

  res.json({ ok: true });
}

export function handlePresenceCheck(req: Request, res: Response): void {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  if (secret) {
    const header = req.headers['x-internal-secret'];
    if (header !== secret) {
      logEvents.warn({
        event: 'internal_presence_unauthorized',
      });
      res.status(401).json({ ok: false });
      return;
    }
  }

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
