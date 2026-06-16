import { ApiError } from '@shared';
import type { DirectMessage } from '@contracts/sockets/direct-messages/direct-messages.schema';
import type {
  AcceptGameInvitationOk,
  GameInvitationSummary,
  GetReceivedRoomInvitationsOk,
  GetSentRoomInvitationsOk,
  SendGameInvitationOk,
} from '@contracts/game-invitations/game-invitations.contracts';

import {
  countUnreadDirectMessagesForFriendship,
  countActivePendingInvitationsSentByUser,
  countRecentGameInvitationsSentByUser,
  createGameInvitationDirectMessage,
  findActivePendingInvitationBetweenUsers,
  findGameInvitationById,
  listPendingGameInvitationsForUser,
  listPendingInviteesForSender,
  listReceivedInvitationsByRoom,
  listSentInvitationsByRoom,
  markGameInvitationAccepted,
  markReceivedInvitationsAcceptedByRoom,
} from '../direct-messages/direct-messages.repo';
import { toDirectMessage } from '../direct-messages/direct-messages.mapper';
import {
  notifyGameInvitationReceived,
  notifyGameInvitationSummary,
} from '../friendships/friendships.notify';
import { findFriendshipByPair, findUserBrief } from '../friendships/friendships.repo';
import {
  acceptInvitationRoom,
  dispatchDirectMessage,
  prepareInvitationRoom,
  resolveActiveInvitationIds,
  validateInvitationReceiver,
} from './game-invitations.socket-client';

const INVITATION_TTL_MS = 5 * 60 * 1000;
const SAME_USER_COOLDOWN_MS = 60 * 1000;
const SEND_WINDOW_MS = 10 * 60 * 1000;
const MAX_ACTIVE_PENDING_SENT = 5;
const MAX_SENT_PER_WINDOW = 10;

async function buildGameInvitationSummary(userId: string): Promise<GameInvitationSummary> {
  const now = new Date();
  const invitations = await listPendingGameInvitationsForUser({ invitedUserId: userId, now });
  const actionable = invitations
    .filter((invitation) => invitation.gameInvitationRoomId !== null)
    .map((invitation) => ({
      invitationId: invitation.id,
      roomId: invitation.gameInvitationRoomId as number,
    }));
  const activeInvitationIds = await resolveActiveInvitationIds({
    userId,
    invitations: actionable,
  });

  return {
    activeInvitationCount: activeInvitationIds.length,
    activeInvitationIds,
  };
}

async function notifyInvitationSummary(userId: string): Promise<GameInvitationSummary> {
  const summary = await buildGameInvitationSummary(userId);
  await notifyGameInvitationSummary(userId, summary);
  return summary;
}

function assertGameInvitationRow(message: DirectMessage): asserts message is Extract<
  DirectMessage,
  { type: 'game_invitation' }
> {
  if (message.type !== 'game_invitation') {
    throw new ApiError('INTERNAL_ERROR');
  }
}

export async function getActiveGameInvitationSummary(
  userId: string,
): Promise<GameInvitationSummary> {
  return buildGameInvitationSummary(userId);
}

export async function getSentRoomInvitations(
  senderId: string,
  roomId: number,
): Promise<GetSentRoomInvitationsOk> {
  const now = new Date();
  const rows = await listSentInvitationsByRoom({ senderId, roomId, now });
  return {
    invitations: rows.map((r) => ({
      id: r.id,
      invitedUserId: r.invitedUserId,
      invitedUsername: r.invitedUsername,
      acceptedAt: r.acceptedAt?.toISOString() ?? null,
      expiresAt: r.expiresAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function getReceivedRoomInvitations(
  invitedUserId: string,
  roomId: number,
): Promise<GetReceivedRoomInvitationsOk> {
  const now = new Date();
  const rows = await listReceivedInvitationsByRoom({ invitedUserId, roomId, now });
  return {
    invitations: rows.map((r) => ({
      id: r.id,
      senderUserId: r.senderUserId,
      senderUsername: r.senderUsername,
      acceptedAt: r.acceptedAt?.toISOString() ?? null,
      expiresAt: r.expiresAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function markJoinedRoomInvitations(
  invitedUserId: string,
  roomId: number,
): Promise<void> {
  const now = new Date();
  const senderIds = await markReceivedInvitationsAcceptedByRoom({ invitedUserId, roomId, now });
  await Promise.all([
    notifyInvitationSummary(invitedUserId),
    ...senderIds.map((senderId) => notifyInvitationSummary(senderId)),
  ]);
}

export async function notifyPendingInviteesForSender(senderId: string): Promise<void> {
  const now = new Date();
  const inviteeIds = await listPendingInviteesForSender({ senderId, now });
  await Promise.all([
    notifyInvitationSummary(senderId),
    ...inviteeIds.map((inviteeId) => notifyInvitationSummary(inviteeId)),
  ]);
}

export async function sendGameInvitation(
  currentUserId: string,
  friendUserId: string,
): Promise<SendGameInvitationOk> {
  if (currentUserId === friendUserId) {
    throw new ApiError('GAME_INVITATION_NOT_FRIEND');
  }

  const [friendship, inviter, invitee] = await Promise.all([
    findFriendshipByPair(currentUserId, friendUserId),
    findUserBrief(currentUserId),
    findUserBrief(friendUserId),
  ]);

  if (!friendship || friendship.status !== 'accepted') {
    throw new ApiError('GAME_INVITATION_NOT_FRIEND');
  }

  if (!inviter || !invitee) {
    throw new ApiError('USER_NOT_FOUND');
  }

  const now = new Date();

  const [duplicatePending, activePendingCount, sentInWindow] = await Promise.all([
    findActivePendingInvitationBetweenUsers({
      senderId: currentUserId,
      invitedUserId: friendUserId,
      now,
    }),
    countActivePendingInvitationsSentByUser({
      senderId: currentUserId,
      now,
    }),
    countRecentGameInvitationsSentByUser({
      senderId: currentUserId,
      since: new Date(now.getTime() - SEND_WINDOW_MS),
    }),
  ]);

  if (duplicatePending) {
    const duplicateAgeMs = now.getTime() - duplicatePending.createdAt.getTime();
    throw new ApiError(
      duplicateAgeMs < SAME_USER_COOLDOWN_MS
        ? 'GAME_INVITATION_RECENT_DUPLICATE'
        : 'GAME_INVITATION_DUPLICATE_PENDING',
    );
  }

  if (activePendingCount >= MAX_ACTIVE_PENDING_SENT) {
    throw new ApiError('GAME_INVITATION_PENDING_LIMIT');
  }

  if (sentInWindow >= MAX_SENT_PER_WINDOW) {
    throw new ApiError('GAME_INVITATION_RATE_LIMITED');
  }

  const room = await prepareInvitationRoom({
    inviterUserId: currentUserId,
    inviterUsername: inviter.username,
  });

  if (!room.ok) {
    throw new ApiError(
      room.error === 'room_connection_required'
        ? 'GAME_INVITATION_ROOM_REQUIRED'
        : 'GAME_INVITATION_ROOM_UNAVAILABLE',
    );
  }

  if (room.room.id <= 0 || room.room.isGameRoomFull) {
    throw new ApiError('GAME_INVITATION_ROOM_UNAVAILABLE');
  }

  const receiverCanJoin = await validateInvitationReceiver({
    invitedUserId: friendUserId,
    roomId: room.room.id,
  });

  if (!receiverCanJoin.ok) {
    throw new ApiError(
      receiverCanJoin.error === 'already_in_room'
        ? 'GAME_INVITATION_ALREADY_IN_ROOM'
        : 'GAME_INVITATION_ROOM_UNAVAILABLE',
    );
  }

  const expiresAt = new Date(now.getTime() + INVITATION_TTL_MS);
  const saved = await createGameInvitationDirectMessage({
    friendshipId: friendship.id,
    senderId: currentUserId,
    body: `Game invitation to room ${room.room.id}`,
    roomId: room.room.id,
    invitedUserId: friendUserId,
    expiresAt,
  });
  const message = toDirectMessage(saved);
  assertGameInvitationRow(message);

  const unreadCount = await countUnreadDirectMessagesForFriendship({
    friendshipId: friendship.id,
    userId: friendUserId,
  });
  const [, summary] = await Promise.all([
    notifyInvitationSummary(friendUserId),
    notifyInvitationSummary(currentUserId),
  ]);
  await notifyGameInvitationReceived(friendUserId, {
    friendUserId: currentUserId,
    message,
  });

  await dispatchDirectMessage({
    currentUserId,
    friendUserId,
    unreadCount,
    message,
  });

  return {
    message,
    room: room.room,
    summary,
  };
}

export async function acceptGameInvitation(
  currentUserId: string,
  invitationId: string,
): Promise<AcceptGameInvitationOk> {
  const invitation = await findGameInvitationById(invitationId);

  if (
    !invitation
    || invitation.type !== 'game_invitation'
    || invitation.gameInvitationInvitedUserId !== currentUserId
  ) {
    throw new ApiError('GAME_INVITATION_NOT_FOUND');
  }

  if (invitation.gameInvitationAcceptedAt) {
    throw new ApiError('GAME_INVITATION_ALREADY_ACCEPTED');
  }

  if (
    !invitation.gameInvitationExpiresAt
    || invitation.gameInvitationExpiresAt.getTime() <= Date.now()
  ) {
    throw new ApiError('GAME_INVITATION_EXPIRED');
  }

  if (invitation.gameInvitationRoomId === null) {
    throw new ApiError('GAME_INVITATION_ROOM_UNAVAILABLE');
  }

  const invitee = await findUserBrief(currentUserId);
  if (!invitee) {
    throw new ApiError('USER_NOT_FOUND');
  }

  const room = await acceptInvitationRoom({
    invitedUserId: currentUserId,
    invitedUsername: invitee.username,
    roomId: invitation.gameInvitationRoomId,
  });

  if (!room.ok) {
    throw new ApiError(
      room.error === 'already_in_room'
        ? 'GAME_INVITATION_ALREADY_IN_ROOM'
        : 'GAME_INVITATION_NOT_JOINABLE',
    );
  }

  const now = new Date();

  const accepted = await markGameInvitationAccepted({
    invitationId,
    acceptedByUserId: currentUserId,
    now,
  });

  if (!accepted) {
    throw new ApiError('GAME_INVITATION_ALREADY_ACCEPTED');
  }

  const originalSenderId = invitation.senderId;
  const [pendingInviteesOfAccepter, pendingInviteesOfSender] = await Promise.all([
    listPendingInviteesForSender({ senderId: currentUserId, now }),
    listPendingInviteesForSender({ senderId: originalSenderId, now }),
  ]);

  const allToNotify = new Set([
    currentUserId,
    originalSenderId,
    ...pendingInviteesOfAccepter,
    ...pendingInviteesOfSender,
  ]);

  const [summary] = await Promise.all(
    [...allToNotify].map((id) => notifyInvitationSummary(id)),
  );

  return {
    invitationId,
    room: room.room,
    summary,
  };
}
