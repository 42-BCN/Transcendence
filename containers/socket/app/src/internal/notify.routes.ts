import type { Request, Response } from 'express';
import { z } from 'zod';

import {
  FriendshipInternalNotifyBodySchema,
  FriendshipPresenceCheckBodySchema,
  gameInvitationSocketEvents,
  friendshipSocketUserIdSchema,
  friendshipSocketEvents,
} from '@contracts/sockets/friendships/friendships.schema';
import {
  emitToUser,
  getUsersPresence,
  subscribeUserToFriendStatus,
} from '../features/friends.socket';
import { disconnectAuthenticatedSessionSockets } from '../sockets/socket.register';
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

  if (!secret) {
    logEvents.error({ event: 'internal_secret_missing' });
    res.status(503).json({ ok: false });
    return false;
  }

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

    case gameInvitationSocketEvents.updated:
      emitToUser(body.userId, body.event, body.payload);
      break;

    case gameInvitationSocketEvents.received:
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

  const presence = getUsersPresence(userIds);

  res.json({
    ok: true,
    data: { presence },
  });
}

export function handleDisconnectSessionSockets(req: Request, res: Response): void {
  if (!validateInternalSecret(req, res, 'internal_disconnect_session_unauthorized')) return;

  const parsed = DisconnectSessionBodySchema.safeParse(req.body);

  if (!parsed.success) {
    logEvents.warn({
      event: 'internal_disconnect_session_validation_failed',
      errors: parsed.error.flatten(),
    });
    respondBadRequest(res, parsed.error);
    return;
  }

  const disconnectedSockets = disconnectAuthenticatedSessionSockets(
    parsed.data.userId,
    parsed.data.sessionId,
  );

  logEvents.info({
    event: 'internal_disconnect_session_succeeded',
    userId: parsed.data.userId,
    sessionId: parsed.data.sessionId,
    disconnectedSockets,
  });

  res.json({
    ok: true,
    data: {
      disconnectedSockets,
    },
  });
}
const DisconnectSessionBodySchema = z.object({
  userId: friendshipSocketUserIdSchema,
  sessionId: z.string().min(1),
});
