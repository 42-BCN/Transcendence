import type { Request, Response } from 'express';

import { FriendshipFriendsListBodySchema } from '@contracts/sockets/friendships/friendships.schema';

import { listFriendsForUser } from './friendships.repo';

const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL ?? 'https://socket:3100';

export function handleInternalFriendsList(req: Request, res: Response): void {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  if (secret) {
    const header = req.headers['x-internal-secret'];
    if (header !== secret) {
      res.status(401).json({ ok: false });
      return;
    }
  }

  const parsed = FriendshipFriendsListBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  listFriendsForUser(parsed.data.userId)
    .then((friends) => {
      const friendIds = friends.map((f) => f.id);
      res.json({ ok: true, data: { friendIds } });
    })
    .catch(() => {
      res.status(500).json({ ok: false });
    });
}

export async function resolveOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
  if (userIds.length === 0) return {};

  try {
    const secret = process.env.SOCKET_INTERNAL_SECRET;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (secret) headers['x-internal-secret'] = secret;

    const res = await fetch(`${SOCKET_SERVICE_URL}/internal/presence`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userIds }),
    });

    if (!res.ok) {
      console.warn('[friendships.presence] socket presence check failed', res.status);
      return Object.fromEntries(userIds.map((id) => [id, false]));
    }

    const body = (await res.json()) as {
      ok: boolean;
      data?: { status: Record<string, boolean> };
    };

    return body.data?.status ?? {};
  } catch (error) {
    console.error('[friendships.presence] error', error);
    return Object.fromEntries(userIds.map((id) => [id, false]));
  }
}
