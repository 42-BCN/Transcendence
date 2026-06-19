import type { DirectMessage } from '@contracts/sockets/direct-messages/direct-messages.schema';
import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';

const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL ?? 'https://socket:3100';

type InternalErrorResponse = {
  error?: string;
};

type InternalResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string | null };

export type PrepareInvitationRoomResult =
  | { ok: true; room: gameRoomState }
  | { ok: false; error: 'room_connection_required' | 'room_unavailable' | null };

export type ValidateInvitationReceiverResult =
  | { ok: true }
  | { ok: false; error: 'already_in_room' | 'room_missing' | 'room_full' | null };

export type AcceptInvitationRoomResult =
  | { ok: true; room: gameRoomState }
  | {
    ok: false;
    error:
      | 'already_in_room'
      | 'room_missing'
      | 'room_full'
      | 'error:alredy_joined_another_room'
      | 'error:invalid_room_id'
      | 'error:full_room'
      | null;
  };

function getHeaders(): Record<string, string> {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (secret) {
    headers['x-internal-secret'] = secret;
  }

  return headers;
}

async function postInternal<T>(endpoint: string, body: unknown): Promise<InternalResult<T>> {
  try {
    const response = await fetch(`${SOCKET_SERVICE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const json = (await response.json().catch(() => null)) as InternalErrorResponse | null;
      return { ok: false, error: json?.error ?? null };
    }

    const json = (await response.json()) as { data?: T };
    return { ok: true, data: json.data as T };
  } catch {
    return { ok: false, error: null };
  }
}

export async function prepareInvitationRoom(args: {
  inviterUserId: string;
  inviterUsername: string;
}): Promise<PrepareInvitationRoomResult> {
  const result = await postInternal<{ room: gameRoomState }>(
    '/internal/game-invitations/prepare-room',
    args,
  );

  if (!result.ok) {
    return {
      ok: false,
      error:
        result.error === 'room_connection_required' || result.error === 'room_unavailable'
          ? result.error
          : null,
    };
  }

  if (!result.data?.room) {
    return { ok: false, error: null };
  }

  return { ok: true, room: result.data.room };
}

export async function validateInvitationReceiver(args: {
  invitedUserId: string;
  roomId: number;
}): Promise<ValidateInvitationReceiverResult> {
  const result = await postInternal('/internal/game-invitations/validate-receiver', args);

  if (!result.ok) {
    return {
      ok: false,
      error:
        result.error === 'already_in_room'
        || result.error === 'room_missing'
        || result.error === 'room_full'
          ? result.error
          : null,
    };
  }

  return { ok: true };
}

export async function acceptInvitationRoom(args: {
  invitedUserId: string;
  invitedUsername: string;
  roomId: number;
}): Promise<AcceptInvitationRoomResult> {
  const result = await postInternal<{ room: gameRoomState }>(
    '/internal/game-invitations/accept-room',
    args,
  );

  if (!result.ok) {
    return {
      ok: false,
      error:
        result.error === 'already_in_room'
        || result.error === 'room_missing'
        || result.error === 'room_full'
        || result.error === 'error:alredy_joined_another_room'
        || result.error === 'error:invalid_room_id'
        || result.error === 'error:full_room'
          ? result.error
          : null,
    };
  }

  if (!result.data?.room) {
    return { ok: false, error: null };
  }

  return { ok: true, room: result.data.room };
}

export async function resolveActiveInvitationIds(args: {
  invitations: { invitationId: string; roomId: number; invitedUserId: string }[];
}): Promise<string[]> {
  const result = await postInternal<{ activeInvitationIds: string[] }>(
    '/internal/game-invitations/status',
    args,
  );

  if (!result.ok) {
    return [];
  }

  return result.data?.activeInvitationIds ?? [];
}

export async function dispatchDirectMessage(args: {
  currentUserId: string;
  friendUserId: string;
  unreadCount: number;
  message: DirectMessage;
}): Promise<void> {
  await postInternal('/internal/direct-messages/dispatch', args);
}
