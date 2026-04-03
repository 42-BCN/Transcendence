import type { ApiResponse } from "../http/response";
import type { ValidationErrorDetails } from "../http/validation";
import type { FriendshipsErrorName } from "./friendships.errors";

export type FriendshipPublic = {
  id: string;
  friendUserId: string;
  friendUsername: string;
  status: "pending" | "accepted";
  isSender: boolean;
  created_at: Date;
};

export type GetFriendshipsOk = { friendships: FriendshipPublic[] };
export type GetFriendshipsResponse = ApiResponse<
  GetFriendshipsOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type GetReceivedRequestsOk = { requests: FriendshipPublic[] };
export type GetReceivedRequestsResponse = ApiResponse<
  GetReceivedRequestsOk,
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
export type SendFriendRequestOk = { friendship: FriendshipPublic };
export type SendFriendRequestResponse = ApiResponse<
  SendFriendRequestOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;

export type AcceptRequestOk = { friendship: FriendshipPublic };
export type AcceptRequestResponse = ApiResponse<
  AcceptRequestOk,
  FriendshipsErrorName,
  ValidationErrorDetails
>;
