import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';

export type FriendshipStatus = 'friend' | 'received' | 'sent' | 'none';

export type FriendshipActionKey =
  | 'message'
  | 'addFriend'
  | 'acceptRequest'
  | 'rejectRequest'
  | 'cancelRequest'
  | 'deleteFriend';

export interface FriendshipActionHandlersArgs {
  userId: string;
  friend?: FriendPublic;
  requestReceived?: FriendshipPublic;
  requestSent?: FriendshipPublic;
  setError: (error?: FriendshipActionError) => void;
  removeFriendById: (friendId: string) => void;
  removePendingById: (list: 'pendingReceived' | 'pendingSent', friendshipId: string) => void;
  addPendingRequest: (friendship: FriendshipPublic, wasAutoAccepted: boolean) => void;
  acceptPendingById: (friendshipId: string) => void;
}

export interface FriendshipActionHandlers {
  handleDeleteFriend: () => Promise<void>;
  handleAcceptRequest: () => Promise<void>;
  handleRejectRequest: () => Promise<void>;
  handleCancelRequest: () => Promise<void>;
  handleAddFriend: () => Promise<void>;
}

export interface FriendshipActionError {
  code: string;
}

export type FriendshipAction =
  | {
      key: FriendshipActionKey;
      type: 'link';
      label: string;
      href: string;
      badgeCount?: number;
    }
  | {
      key: FriendshipActionKey;
      type: 'button';
      label: string;
      onPress: () => Promise<void>;
      error?: FriendshipActionError;
    };

export interface CreateFriendshipActionsArgs {
  userId: string;
  username?: string;
  status: FriendshipStatus;
  t: (key: string) => string;
  handlers: FriendshipActionHandlers;
  error?: FriendshipActionError;
  unreadMessageCount?: number;
}
