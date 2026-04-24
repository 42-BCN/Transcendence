import {
  FriendshipInternalNotifyBodySchema,
  friendshipSocketEvents,
  type FriendshipInternalNotifyBody,
  type FriendAcceptedNotificationPayload,
  type FriendRejectedNotificationPayload,
  type FriendRequestNotificationPayload,
} from '@contracts/sockets/friendships/friendships.schema';
import { logEvents } from './friendships.logs';

const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL ?? 'https://socket:3100';

type UserBrief = { userId: string; username: string };

async function postNotify(body: FriendshipInternalNotifyBody): Promise<void> {
  const parsed = FriendshipInternalNotifyBodySchema.safeParse(body);

  if (!parsed.success) {
    logEvents.error({
      event: 'friendship_socket_notify_validation_failed',
      errors: parsed.error.flatten(),
    });
    throw parsed.error;
  }

  logEvents.info({
    event: 'friendship_socket_notify_requested',
    socketEvent: parsed.data.event,
    userId: parsed.data.userId,
  });

  const secret = process.env.SOCKET_INTERNAL_SECRET;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (secret) headers['x-internal-secret'] = secret;

  const res = await fetch(`${SOCKET_SERVICE_URL}/internal/notify`, {
    method: 'POST',
    headers,
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    logEvents.warn({
      event: 'friendship_socket_notify_failed',
      socketEvent: parsed.data.event,
      userId: parsed.data.userId,
      status: res.status,
      response: await res.text().catch(() => ''),
    });
    return;
  }

  logEvents.info({
    event: 'friendship_socket_notify_succeeded',
    socketEvent: parsed.data.event,
    userId: parsed.data.userId,
    status: res.status,
  });
}

export async function notifyFriendRequest(
  targetUserId: string,
  payload: FriendRequestNotificationPayload,
): Promise<void> {
  try {
    await postNotify({
      event: friendshipSocketEvents.request,
      userId: targetUserId,
      payload,
    });
  } catch (e) {
    logEvents.error({
      event: 'friendship_socket_notify_request_error',
      socketEvent: friendshipSocketEvents.request,
      userId: targetUserId,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

export async function notifyFriendAccepted(userA: UserBrief, userB: UserBrief): Promise<void> {
  const payloadForUserA: FriendAcceptedNotificationPayload = {
    friendUserId: userB.userId,
    friendUsername: userB.username,
  };
  const payloadForUserB: FriendAcceptedNotificationPayload = {
    friendUserId: userA.userId,
    friendUsername: userA.username,
  };

  try {
    await Promise.all([
      postNotify({
        event: friendshipSocketEvents.accepted,
        userId: userA.userId,
        payload: payloadForUserA,
      }),
      postNotify({
        event: friendshipSocketEvents.accepted,
        userId: userB.userId,
        payload: payloadForUserB,
      }),
    ]);
  } catch (e) {
    logEvents.error({
      event: 'friendship_socket_notify_request_error',
      socketEvent: friendshipSocketEvents.accepted,
      userIds: [userA.userId, userB.userId],
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

export async function notifyFriendRejected(
  senderId: string,
  payload: FriendRejectedNotificationPayload,
): Promise<void> {
  try {
    await postNotify({
      event: friendshipSocketEvents.rejected,
      userId: senderId,
      payload,
    });
  } catch (e) {
    logEvents.error({
      event: 'friendship_socket_notify_request_error',
      socketEvent: friendshipSocketEvents.rejected,
      userId: senderId,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
