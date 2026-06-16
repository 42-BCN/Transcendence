import type { ApiResponse } from '../http/response';
import type { ValidationErrorDetails } from '../http/validation';
import type { GameInvitationsErrorName } from './game-invitations.errors';
import type { DirectMessage } from '../../sockets/direct-messages/direct-messages.schema';
import type { gameRoomState } from '../../sockets/rooms/gameRooms.schema';

export type GameInvitationStatus =
  | 'pending'
  | 'accepted'
  | 'expired'
  | 'unavailable'
  | 'cancelled';

export type GameInvitationDirection = 'sent' | 'received';

export type GameInvitationView = {
  id: string;
  roomId: number;
  direction: GameInvitationDirection;
  friendUserId: string;
  friendUsername: string;
  inviterId: string;
  invitedUserId: string;
  inviterUsername: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
  cancelledAt: string | null;
  status: GameInvitationStatus;
  sourceMessageId: string;
};

export type GetGameInvitationStateOk = {
  invitations: GameInvitationView[];
};

export type GetGameInvitationStateResponse = ApiResponse<
  GetGameInvitationStateOk,
  GameInvitationsErrorName,
  ValidationErrorDetails
>;

export type GameInvitationSummary = {
  activeInvitationCount: number;
  activeInvitationIds: string[];
};

export type SendGameInvitationOk = {
  message: DirectMessage;
  room: gameRoomState;
  summary: GameInvitationSummary;
};

export type SendGameInvitationResponse = ApiResponse<
  SendGameInvitationOk,
  GameInvitationsErrorName,
  ValidationErrorDetails
>;

export type AcceptGameInvitationOk = {
  invitationId: string;
  room: gameRoomState;
  summary: GameInvitationSummary;
};

export type AcceptGameInvitationResponse = ApiResponse<
  AcceptGameInvitationOk,
  GameInvitationsErrorName,
  ValidationErrorDetails
>;

export type DeclineGameInvitationOk = {
  invitationId: string;
  summary: GameInvitationSummary;
};

export type DeclineGameInvitationResponse = ApiResponse<
  DeclineGameInvitationOk,
  GameInvitationsErrorName,
  ValidationErrorDetails
>;
