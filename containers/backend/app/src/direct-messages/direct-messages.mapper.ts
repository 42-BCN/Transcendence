import type { DirectMessage } from '@contracts/sockets/direct-messages/direct-messages.schema';
import type { DirectMessageRow } from './direct-messages.repo';

export function toDirectMessage(row: DirectMessageRow): DirectMessage {
  if (
    row.type === 'game_invitation'
    && row.gameInvitationRoomId !== null
    && row.gameInvitationInvitedUserId
    && row.gameInvitationExpiresAt
  ) {
    return {
      id: row.id,
      createdAt: row.createdAt.getTime(),
      senderId: row.senderId,
      username: row.sender.username,
      readAt: row.readAt?.getTime() ?? null,
      type: 'game_invitation',
      content: {
        invitationId: row.id,
        roomId: String(row.gameInvitationRoomId),
        inviterId: row.senderId,
        invitedUserId: row.gameInvitationInvitedUserId,
        inviterUsername: row.sender.username,
        createdAt: row.createdAt.toISOString(),
        expiresAt: row.gameInvitationExpiresAt.toISOString(),
        acceptedAt: row.gameInvitationAcceptedAt?.toISOString() ?? null,
      },
    };
  }

  return {
    id: row.id,
    createdAt: row.createdAt.getTime(),
    senderId: row.senderId,
    username: row.sender.username,
    readAt: row.readAt?.getTime() ?? null,
    type: 'user',
    content: { text: row.body },
  };
}
