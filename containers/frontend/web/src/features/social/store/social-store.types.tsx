import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type { FriendshipsErrorName } from '@/contracts/api/friendships/friendships.errors';
import type { SearchUserResult } from '@/contracts/api/users/users.contracts';
import type {
  FriendAcceptedNotificationPayload,
  FriendRejectedNotificationPayload,
  FriendRequestNotificationPayload,
} from '@/contracts/sockets/friendships/friendships.schema';

export type PendingListKey = 'pendingReceived' | 'pendingSent';

export type SocialErrorCode = FriendshipsErrorName | 'FETCH_FAILED';

export interface SocialInitialData {
  friends: FriendPublic[];
  pendingReceived: FriendshipPublic[];
  pendingSent: FriendshipPublic[];
  currentUserId: string | null;
  errors: {
    friends?: SocialErrorCode;
    pendingReceived?: SocialErrorCode;
    pendingSent?: SocialErrorCode;
  };
}

export interface GroupedSearchResults {
  online: SearchUserResult[];
  offline: SearchUserResult[];
  requests: SearchUserResult[];
  pending: SearchUserResult[];
  none: SearchUserResult[];
}

export interface SocialState {
  friends: FriendPublic[];
  pendingReceived: FriendshipPublic[];
  pendingSent: FriendshipPublic[];
  currentUserId: string | null;
  searchResults: GroupedSearchResults;
  searchQuery: string;

  setFriends: (friends: FriendPublic[]) => void;
  setPendingReceived: (requests: FriendshipPublic[]) => void;
  setPendingSent: (requests: FriendshipPublic[]) => void;
  setSearchResults: (results: GroupedSearchResults) => void;
  setSearchQuery: (query: string) => void;
  setCurrentUserId: (id: string | null) => void;
  removePendingById: (list: PendingListKey, id: string) => void;
  acceptPendingById: (id: string) => void;
  addPendingRequest: (friendship: FriendshipPublic, wasAutoAccepted?: boolean) => void;

  /** Preferred: set precise presence */
  setFriendPresence: (userId: string, presence: 'online' | 'away' | 'offline') => void;
  receiveFriendRequest: (payload: FriendRequestNotificationPayload) => void;
  receiveFriendAccepted: (payload: FriendAcceptedNotificationPayload) => void;
  receiveFriendRejected: (payload: FriendRejectedNotificationPayload) => void;
}
