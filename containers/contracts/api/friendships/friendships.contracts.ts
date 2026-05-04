import type { ApiResponse } from '../http/response';
import type { ValidationErrorDetails } from '../http/validation';
import type { FriendshipsErrorName } from './friendships.errors';

export type FriendshipPublic = {
  id: string;
  userId: string;
  username: string;
  avatar: string | null;
  status: 'pending' | 'accepted';
  isSender: boolean;
  createdAt: string;
};

/** Accepted friend row for GET /friends (other user only, no session tokens). */
export type FriendPublic = {
  id: string;
  username: string;
  avatar: string | null;
  /** Presence state: 'online' | 'away' | 'offline' */
  presence: 'online' | 'away' | 'offline';
};

export type GetFriendsListOk = { friends: FriendPublic[] };
export type GetFriendsListResponse = ApiResponse<
  GetFriendsListOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type GetFriendshipsOk = { friendships: FriendshipPublic[] };
export type GetFriendshipsResponse = ApiResponse<
  GetFriendshipsOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type GetPendingRequestsOk = { requests: FriendshipPublic[] };
export type GetPendingRequestsResponse = ApiResponse<
  GetPendingRequestsOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type GetSentRequestsOk = { requests: FriendshipPublic[] };
export type GetSentRequestsResponse = ApiResponse<
  GetSentRequestsOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type SendFriendRequestBody = { targetUserId: string };
export type SendFriendRequestOk = {
  friendship: FriendshipPublic;
  wasAutoAccepted: boolean;
};
export type SendFriendRequestResponse = ApiResponse<
  SendFriendRequestOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type RespondFriendRequestOk = {
  friendship?: FriendshipPublic;
  action: 'accept' | 'reject';
};
export type RespondFriendRequestResponse = ApiResponse<
  RespondFriendRequestOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type DeleteFriendshipOk = { deleted: true };
export type DeleteFriendshipResponse = ApiResponse<
  DeleteFriendshipOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;
