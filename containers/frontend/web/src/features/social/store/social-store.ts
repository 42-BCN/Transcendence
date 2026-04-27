import { createStore } from 'zustand/vanilla';
import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type {
  SocialInitialData,
  SocialState,
  PendingListKey,
  GroupedSearchResults,
} from './social-store.types';

export const emptyGroupedSearchResults = (): GroupedSearchResults => ({
  online: [],
  offline: [],
  requests: [],
  pending: [],
  none: [],
});

const createInitialState = (initialData: SocialInitialData) => ({
  friends: initialData.friends,
  pendingReceived: initialData.pendingReceived,
  pendingSent: initialData.pendingSent,
  currentUserId: initialData.currentUserId,
  searchResults: emptyGroupedSearchResults(),
  searchQuery: '',
});

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
  (state: SocialState): Partial<SocialState> => {
    const request = state.pendingReceived.find((r) => r.id === id);
    const searchItem = state.searchResults.none.find((r) => r.friendshipId === id);

    if (!request && !searchItem) {
      return {};
    }

    const userData = request ?? searchItem;

    const newFriend: FriendPublic = {
      id: request ? request.userId : userData.id,
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

export function createSocialStore(initialData: SocialInitialData) {
  return createStore<SocialState>((set) => ({
    ...createInitialState(initialData),

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
}

export type SocialStore = ReturnType<typeof createSocialStore>;
