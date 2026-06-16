import type { ApiResponse } from '../http/response';
import type { ValidationErrorDetails } from '../http/validation';
import type { GameInvitationsErrorName } from './game-invitations.errors';
import type { DirectMessage } from '../../sockets/direct-messages/direct-messages.schema';
import type { gameRoomState } from '../../sockets/rooms/gameRooms.schema';

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

export type GetActiveGameInvitationSummaryOk = GameInvitationSummary;

export type GetActiveGameInvitationSummaryResponse = ApiResponse<
  GetActiveGameInvitationSummaryOk,
  GameInvitationsErrorName,
  ValidationErrorDetails
>;

export type SentRoomInvitation = {
  id: string;
  invitedUserId: string;
  invitedUsername: string;
  acceptedAt: string | null;
  expiresAt: string;
  createdAt: string;
};

export type GetSentRoomInvitationsOk = {
  invitations: SentRoomInvitation[];
};

export type GetSentRoomInvitationsResponse = ApiResponse<
  GetSentRoomInvitationsOk,
  GameInvitationsErrorName,
  ValidationErrorDetails
>;

export type ReceivedRoomInvitation = {
  id: string;
  senderUserId: string;
  senderUsername: string;
  acceptedAt: string | null;
  expiresAt: string;
  createdAt: string;
};

export type GetReceivedRoomInvitationsOk = { invitations: ReceivedRoomInvitation[] };

export type GetReceivedRoomInvitationsResponse = ApiResponse<
  GetReceivedRoomInvitationsOk,
  GameInvitationsErrorName,
  ValidationErrorDetails
>;
