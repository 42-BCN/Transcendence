import { logEvents } from '../socket.logs';

import type {
  DirectMessage,
  DirectMessageHistory,
} from '@contracts/sockets/direct-messages/direct-messages.schema';

const processEnv = globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

const BACKEND_URL = processEnv.process?.env?.BACKEND_URL ?? 'https://backend:4000';

function getHeaders(): Record<string, string> {
  const secret = processEnv.process?.env?.SOCKET_INTERNAL_SECRET;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (secret) headers['x-internal-secret'] = secret;

  return headers;
}

export async function fetchDirectMessageHistory(args: {
  currentUserId: string;
  friendUserId: string;
}): Promise<DirectMessageHistory> {
  try {
    const res = await fetch(`${BACKEND_URL}/internal/direct-messages/history`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(args),
    });

    if (!res.ok) {
      logEvents.warn({
        event: 'fetch_direct_message_history_failed',
        status: res.status,
        currentUserId: args.currentUserId,
        friendUserId: args.friendUserId,
      });
      return [];
    }

    const body = (await res.json()) as {
      ok: boolean;
      data?: { messages: DirectMessage[] };
    };

    return body.data?.messages ?? [];
  } catch (error) {
    logEvents.error({
      event: 'fetch_direct_message_history_error',
      currentUserId: args.currentUserId,
      friendUserId: args.friendUserId,
      error,
    });
    return [];
  }
}

export async function sendDirectMessage(args: {
  currentUserId: string;
  friendUserId: string;
  text: string;
}): Promise<{ message: DirectMessage; unreadCount: number } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/internal/direct-messages/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(args),
    });

    if (!res.ok) {
      logEvents.warn({
        event: 'send_direct_message_failed',
        status: res.status,
        currentUserId: args.currentUserId,
        friendUserId: args.friendUserId,
      });
      return null;
    }

    const body = (await res.json()) as {
      ok: boolean;
      data?: { message: DirectMessage; unreadCount: number };
    };

    if (!body.data?.message) return null;

    return {
      message: body.data.message,
      unreadCount: body.data.unreadCount ?? 0,
    };
  } catch (error) {
    logEvents.error({
      event: 'send_direct_message_error',
      currentUserId: args.currentUserId,
      friendUserId: args.friendUserId,
      error,
    });
    return null;
  }
}

export async function markDirectMessagesRead(args: {
  currentUserId: string;
  friendUserId: string;
}): Promise<number | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/internal/direct-messages/read`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(args),
    });

    if (!res.ok) {
      logEvents.warn({
        event: 'mark_direct_messages_read_failed',
        status: res.status,
        currentUserId: args.currentUserId,
        friendUserId: args.friendUserId,
      });
      return null;
    }

    const body = (await res.json()) as {
      ok: boolean;
      data?: { unreadCount: number };
    };

    return body.data?.unreadCount ?? 0;
  } catch (error) {
    logEvents.error({
      event: 'mark_direct_messages_read_error',
      currentUserId: args.currentUserId,
      friendUserId: args.friendUserId,
      error,
    });
    return null;
  }
}
