import { create } from 'zustand';
import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type { SearchUserResult } from '@/contracts/api/users/users.contracts';

export type PendingListKey = 'pendingReceived' | 'pendingSent';

interface SocialState {
  friends: FriendPublic[];
  pendingReceived: FriendshipPublic[];
  pendingSent: FriendshipPublic[];
  searchResults: SearchUserResult[];
  searchQuery: string;
  currentUserId: string | null;

  // Actions
  setFriends: (friends: FriendPublic[]) => void;
  setPendingReceived: (requests: FriendshipPublic[]) => void;
  setPendingSent: (requests: FriendshipPublic[]) => void;
  setSearchResults: (results: SearchUserResult[]) => void;
  setSearchQuery: (query: string) => void;
  setCurrentUserId: (id: string) => void;
  removePendingById: (list: PendingListKey, id: string) => void;
  acceptPendingById: (id: string) => void;
  addPendingRequest: (friendship: FriendshipPublic, wasAutoAccepted?: boolean) => void;
}

// --- Initial State ---
const initialState = {
  friends: [],
  pendingReceived: [],
  pendingSent: [],
  searchResults: [],
  searchQuery: '',
  currentUserId: null,
};

// --- Action Handlers (State Updaters) ---
const handleRemovePending =
  (list: PendingListKey, id: string) =>
  (state: SocialState): Partial<SocialState> => ({
    [list]: state[list].filter((item) => item.id !== id),
    searchResults: state.searchResults.map((item) =>
      item.friendshipId === id
        ? { ...item, friendshipStatus: 'none', friendshipId: null, senderId: null }
        : item,
    ),
  });

const handleAcceptPending =
  (id: string) =>
  (state: SocialState): Partial<SocialState> | SocialState => {
    const request = state.pendingReceived.find((r) => r.id === id);
    const isSearchItem = !request && state.searchResults.find((r) => r.friendshipId === id);

    if (!request && !isSearchItem) return state;

    const userData = request || state.searchResults.find((r) => r.friendshipId === id)!;

    const newFriend: FriendPublic = {
      id: request ? request.userId : (userData as SearchUserResult).id,
      username: userData.username,
      avatar: userData.avatar,
      isOnline: false,
    };

    return {
      pendingReceived: state.pendingReceived.filter((r) => r.id !== id),
      friends: [...state.friends, newFriend],
      searchResults: state.searchResults.map((item) =>
        item.friendshipId === id ? { ...item, friendshipStatus: 'accepted' } : item,
      ),
    };
  };

const handleAddPending =
  (friendship: FriendshipPublic, wasAutoAccepted?: boolean) =>
  (state: SocialState): Partial<SocialState> => {
    if (wasAutoAccepted || friendship.status === 'accepted') {
      const newFriend: FriendPublic = {
        id: friendship.userId,
        username: friendship.username,
        avatar: friendship.avatar,
        isOnline: false,
      };

      return {
        friends: [...state.friends, newFriend],
        searchResults: state.searchResults.map((item) =>
          item.id === friendship.userId
            ? { ...item, friendshipStatus: 'accepted', friendshipId: friendship.id }
            : item,
        ),
      };
    }

    return {
      pendingSent: [...state.pendingSent, friendship],
      searchResults: state.searchResults.map((item) =>
        item.id === friendship.userId
          ? {
              ...item,
              friendshipStatus: 'pending',
              friendshipId: friendship.id,
              senderId: state.currentUserId,
            }
          : item,
      ),
    };
  };

// --- Store Definition ---
export const useSocialStore = create<SocialState>((set) => ({
  ...initialState,

  setFriends: (friends) => set({ friends }),
  setPendingReceived: (pendingReceived) => set({ pendingReceived }),
  setPendingSent: (pendingSent) => set({ pendingSent }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCurrentUserId: (currentUserId) => set({ currentUserId }),

  removePendingById: (list, id) => set(handleRemovePending(list, id)),
  acceptPendingById: (id) => set(handleAcceptPending(id)),
  addPendingRequest: (friendship, wasAutoAccepted) =>
    set(handleAddPending(friendship, wasAutoAccepted)),
}));
