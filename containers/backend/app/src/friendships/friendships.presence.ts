import type { Request, Response } from 'express';

import type { FriendPresence } from '@contracts/api/friendships/friendships.contracts';
import { FriendshipFriendsListBodySchema } from '@contracts/sockets/friendships/friendships.schema';

import { listFriendsForUser } from './friendships.repo';
import { logEvents } from './friendships.logs';

const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL ?? 'https://socket:3100';

function getOfflinePresence(userIds: string[]): Record<string, FriendPresence> {
  return Object.fromEntries(
    userIds.map((id) => [id, 'offline'] satisfies [string, FriendPresence]),
  );
}

export function handleInternalFriendsList(req: Request, res: Response): void {
  const secret = process.env.SOCKET_INTERNAL_SECRET;

  if (!secret) {
    logEvents.error({ event: 'internal_secret_missing' });
    res.status(503).json({ ok: false });
    return;
  }

  if (req.headers['x-internal-secret'] !== secret) {
    res.status(401).json({ ok: false });
    return;
  }

  const parsed = FriendshipFriendsListBodySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  listFriendsForUser(parsed.data.userId)
    .then((friends) => {
      const friendIds = friends.map((friend) => friend.id);

      res.json({ ok: true, data: { friendIds } });
    })
    .catch((error: unknown) => {
      logEvents.error({ event: 'internal_friends_list_failed', error });
      res.status(500).json({ ok: false });
    });
}

export async function resolvePresence(userIds: string[]): Promise<Record<string, FriendPresence>> {
  if (userIds.length === 0) return {};

  try {
    const secret = process.env.SOCKET_INTERNAL_SECRET;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (secret) {
      headers['x-internal-secret'] = secret;
    }

    const res = await fetch(`${SOCKET_SERVICE_URL}/internal/presence`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userIds }),
    });

    if (!res.ok) {
      logEvents.error({
        event: 'socket_presence_check_failed',
        status: res.status,
      });

      return getOfflinePresence(userIds);
    }

    const body = (await res.json()) as {
      ok: boolean;
      data?: { presence: Record<string, FriendPresence> };
    };

    return body.data?.presence ?? getOfflinePresence(userIds);
  } catch (error: unknown) {
    logEvents.error({ event: 'socket_presence_check_error', error });

    return getOfflinePresence(userIds);
  }
}
