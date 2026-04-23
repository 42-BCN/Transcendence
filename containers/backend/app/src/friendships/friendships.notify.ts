const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL ?? 'https://socket:3100';

type UserBrief = { userId: string; username: string };

async function postNotify(body: Record<string, unknown>): Promise<void> {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (secret) headers['x-internal-secret'] = secret;

  const res = await fetch(`${SOCKET_SERVICE_URL}/internal/notify`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn(
      '[friendships.notify] socket notify failed',
      res.status,
      await res.text().catch(() => ''),
    );
  }
}

export async function notifyFriendRequest(
  targetUserId: string,
  payload: {
    senderId: string;
    senderUsername: string;
    friendshipId: string;
  },
): Promise<void> {
  try {
    await postNotify({
      event: 'friends:request',
      userId: targetUserId,
      payload,
    });
  } catch (e) {
    console.error('[friendships.notify] friends:request', e);
  }
}

export async function notifyFriendAccepted(userA: UserBrief, userB: UserBrief): Promise<void> {
  try {
    await Promise.all([
      postNotify({
        event: 'friends:accepted',
        userId: userA.userId,
        payload: {
          userId: userB.userId,
          username: userB.username,
        },
      }),
      postNotify({
        event: 'friends:accepted',
        userId: userB.userId,
        payload: {
          userId: userA.userId,
          username: userA.username,
        },
      }),
    ]);
  } catch (e) {
    console.error('[friendships.notify] friends:accepted', e);
  }
}

export async function notifyFriendRejected(
  senderId: string,
  payload: { rejectedByUserId: string; friendshipId: string },
): Promise<void> {
  try {
    await postNotify({
      event: 'friends:rejected',
      userId: senderId,
      payload,
    });
  } catch (e) {
    console.error('[friendships.notify] friends:rejected', e);
  }
}
