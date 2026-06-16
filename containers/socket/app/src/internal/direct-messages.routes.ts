import type { Request, Response } from 'express';
import { z } from 'zod';

import type { DirectMessage } from '@contracts/sockets/direct-messages/direct-messages.schema';
import { DirectMessageSchema } from '@contracts/sockets/direct-messages/direct-messages.schema';
import { directMessageUnreadSocketEvents } from '@contracts/sockets/friendships/friendships.schema';

import { emitToUser } from '../features/friends.socket';
import { emitDirectMessageToPair } from '../features/direct-messages.socket';

function ensureInternalSecret(req: Request, res: Response): boolean {
  const secret = process.env.SOCKET_INTERNAL_SECRET;

  if (!secret) {
    res.status(503).json({ ok: false });
    return false;
  }

  if (req.headers['x-internal-secret'] !== secret) {
    res.status(401).json({ ok: false });
    return false;
  }

  return true;
}

const DirectMessageDispatchBodySchema = z.strictObject({
  currentUserId: z.string().uuid(),
  friendUserId: z.string().uuid(),
  unreadCount: z.number().int().nonnegative(),
  message: DirectMessageSchema,
});

export function handleInternalDirectMessageDispatch(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = DirectMessageDispatchBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  emitDirectMessageToPair({
    currentUserId: parsed.data.currentUserId,
    friendUserId: parsed.data.friendUserId,
    message: parsed.data.message as DirectMessage,
  });

  emitToUser(parsed.data.friendUserId, directMessageUnreadSocketEvents.updated, {
    otherUserId: parsed.data.currentUserId,
    unreadMessageCount: parsed.data.unreadCount,
  });

  res.json({ ok: true });
}
