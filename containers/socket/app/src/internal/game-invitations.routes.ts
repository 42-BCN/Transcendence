import type { Request, Response } from 'express';
import { z } from 'zod';

import {
  gameRoomsManager,
  hasActiveGameRoomConnection,
} from '../features/game-room/gameRooms.shared';
import {
  broadcastGameRoomState,
  cancelRoomInvitations,
  emitGameRoomJoined,
  emitEmptyGameRoomStateToMember,
  emitGameRoomStateToMember,
  subscribeMemberToGameRoomChannel,
  unsubscribeMemberFromGameRoomChannel,
} from '../features/game-room/gameRoom.socket';

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

const PrepareInvitationRoomBodySchema = z.strictObject({
  inviterUserId: z.string().uuid(),
  inviterUsername: z.string().min(1),
});

const ValidateInvitationReceiverBodySchema = z.strictObject({
  invitedUserId: z.string().uuid(),
  roomId: z.number().int().positive(),
});

const AcceptInvitationRoomBodySchema = z.strictObject({
  invitedUserId: z.string().uuid(),
  invitedUsername: z.string().min(1),
  roomId: z.number().int().positive(),
});

const InvitationStatusBodySchema = z.strictObject({
  userId: z.string().uuid(),
  invitations: z.array(
    z.strictObject({
      invitationId: z.string().uuid(),
      roomId: z.number().int().positive(),
    }),
  ),
});

function toMemberKey(userId: string) {
  return `user:${userId}`;
}

function clearClosedPreviousRoom(
  memberKey: string,
  removal: Exclude<ReturnType<typeof gameRoomsManager.removeUserFromGameRoom>, string>,
) {
  const { room, closed, affectedMemberKeys } = removal;
  if (closed) {
    for (const affectedMemberKey of affectedMemberKeys) {
      emitEmptyGameRoomStateToMember(affectedMemberKey);
      unsubscribeMemberFromGameRoomChannel(affectedMemberKey, room.id);
    }
    cancelRoomInvitations(room.id);
    return;
  }

  unsubscribeMemberFromGameRoomChannel(memberKey, room.id);
  emitEmptyGameRoomStateToMember(memberKey);
  broadcastGameRoomState(room.id, room);
}

function clearPreviousRoom(memberKey: string) {
  const previousRoom = gameRoomsManager.removeUserFromGameRoom(memberKey);
  if (typeof previousRoom !== 'string') {
    clearClosedPreviousRoom(memberKey, previousRoom);
  }
}

function isRoomJoinable(roomId: number) {
  const room = gameRoomsManager.getGameRoomById(roomId);
  if (!room) return { ok: false as const, reason: 'room_missing' };
  if (room.status !== 'open' || room.isGameRoomFull) return { ok: false as const, reason: 'room_full' };
  return { ok: true as const, room };
}

function canUserReceiveInvitation(invitedUserId: string, roomId: number) {
  const invitedMemberKey = toMemberKey(invitedUserId);
  const inviteeCurrentRoom = gameRoomsManager.getUserCurrentGameRoom(invitedMemberKey);
  if (typeof inviteeCurrentRoom !== 'string' && inviteeCurrentRoom.id === roomId) {
    return { ok: false as const, reason: 'already_in_room' };
  }
  if (typeof inviteeCurrentRoom !== 'string') {
    return { ok: false as const, reason: 'already_in_room' };
  }
  return isRoomJoinable(roomId);
}

export function handlePrepareInvitationRoom(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = PrepareInvitationRoomBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  const memberKey = toMemberKey(parsed.data.inviterUserId);
  if (!hasActiveGameRoomConnection(memberKey)) {
    res.status(409).json({ ok: false, error: 'room_connection_required' });
    return;
  }

  const room = gameRoomsManager.ensureUserGameRoom(memberKey, parsed.data.inviterUsername);
  if (typeof room === 'string') {
    res.status(409).json({ ok: false, error: 'room_unavailable' });
    return;
  }

  subscribeMemberToGameRoomChannel(memberKey, room.id);
  emitGameRoomStateToMember(memberKey, room);

  res.json({
    ok: true,
    data: {
      room,
    },
  });
}

export function handleValidateInvitationReceiver(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = ValidateInvitationReceiverBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  const result = canUserReceiveInvitation(parsed.data.invitedUserId, parsed.data.roomId);
  if (!result.ok) {
    res.status(409).json({ ok: false, error: result.reason });
    return;
  }

  res.json({ ok: true });
}

export function handleAcceptInvitationRoom(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = AcceptInvitationRoomBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  const precheck = canUserReceiveInvitation(parsed.data.invitedUserId, parsed.data.roomId);
  if (!precheck.ok) {
    res.status(409).json({ ok: false, error: precheck.reason });
    return;
  }

  const memberKey = toMemberKey(parsed.data.invitedUserId);
  clearPreviousRoom(memberKey);

  const joinResult = gameRoomsManager.joinUserToGameRoom(
    memberKey,
    parsed.data.invitedUsername,
    parsed.data.roomId,
  );

  if (typeof joinResult === 'string') {
    res.status(409).json({ ok: false, error: joinResult });
    return;
  }

  emitGameRoomStateToMember(memberKey, joinResult);
  subscribeMemberToGameRoomChannel(memberKey, joinResult.id);
  emitGameRoomJoined(joinResult.id, parsed.data.invitedUsername);
  broadcastGameRoomState(joinResult.id, joinResult);

  res.json({
    ok: true,
    data: {
      room: joinResult,
    },
  });
}

export function handleInvitationStatus(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = InvitationStatusBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    return;
  }

  const activeInvitationIds = parsed.data.invitations
    .filter((invitation) => isRoomJoinable(invitation.roomId).ok)
    .map((invitation) => invitation.invitationId);

  res.json({
    ok: true,
    data: {
      activeInvitationIds,
    },
  });
}
