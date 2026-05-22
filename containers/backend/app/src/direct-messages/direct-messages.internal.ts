import type { Request, Response } from 'express';

import {
  DirectMessageSendBodySchema,
  DirectMessageThreadBodySchema,
} from '@contracts/sockets/direct-messages/direct-messages.schema';

import { findFriendshipByPair } from '../friendships/friendships.repo';
import { createDirectMessage, listDirectMessagesForFriendship } from './direct-messages.repo';

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

export function handleInternalDirectMessageHistory(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = DirectMessageThreadBodySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  findFriendshipByPair(parsed.data.currentUserId, parsed.data.friendUserId)
    .then(async (friendship) => {
      if (!friendship || friendship.status !== 'accepted') {
        res.status(403).json({ ok: false });
        return;
      }

      const rows = await listDirectMessagesForFriendship(friendship.id);

      res.json({
        ok: true,
        data: {
          messages: rows.map((row) => ({
            id: row.id,
            createdAt: row.createdAt.getTime(),
            senderId: row.senderId,
            username: row.sender.username,
            type: 'user' as const,
            content: { text: row.body },
          })),
        },
      });
    })
    .catch((error: unknown) => {
      console.error('[direct-messages] failed to load history', error);
      res.status(500).json({ ok: false });
    });
}

export function handleInternalDirectMessageSend(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = DirectMessageSendBodySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  findFriendshipByPair(parsed.data.currentUserId, parsed.data.friendUserId)
    .then(async (friendship) => {
      if (!friendship || friendship.status !== 'accepted') {
        res.status(403).json({ ok: false });
        return;
      }

      const saved = await createDirectMessage({
        friendshipId: friendship.id,
        senderId: parsed.data.currentUserId,
        body: parsed.data.text,
      });

      res.json({
        ok: true,
        data: {
          message: {
            id: saved.id,
            createdAt: saved.createdAt.getTime(),
            senderId: saved.senderId,
            username: saved.sender.username,
            type: 'user' as const,
            content: { text: saved.body },
          },
        },
      });
    })
    .catch((error: unknown) => {
      console.error('[direct-messages] failed to save message', error);
      res.status(500).json({ ok: false });
    });
}
