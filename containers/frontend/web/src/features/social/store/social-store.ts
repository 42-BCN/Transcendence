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

const defaultErrors = {
  friends: undefined,
  pendingReceived: undefined,
  pendingSent: undefined,
};

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
  errors: initialData.errors ?? defaultErrors,
});

const updateResults = (
  results: GroupedSearchResults,
  predicate: (item: any) => boolean,
  update: (item: any) => any,
): GroupedSearchResults => ({
  online: results.online.map((i) => (predicate(i) ? update(i) : i)),
  offline: results.offline.map((i) => (predicate(i) ? update(i) : i)),
  requests: results.requests.map((i) => (predicate(i) ? update(i) : i)),
  pending: results.pending.map((i) => (predicate(i) ? update(i) : i)),
  none: results.none.map((i) => (predicate(i) ? update(i) : i)),
});

const handleRemovePending =
  (list: PendingListKey, id: string) =>
  (state: SocialState): Partial<SocialState> => ({
    [list]: state[list].filter((item) => item.id !== id),
    searchResults: updateResults(
      state.searchResults,
      (item) => item.friendshipId === id,
      (item) => ({ ...item, friendshipStatus: 'none', friendshipId: null, senderId: null }),
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

    const newFriend: FriendshipPublic = {
      id: request ? request.id : userData.friendshipId!,
      userId: request ? request.userId : userData.id,
      username: userData.username,
      avatar: userData.avatar,
      status: 'accepted',
      isSender: request ? request.isSender : userData.senderId === state.currentUserId,
      createdAt: request ? request.createdAt : new Date().toISOString(),
    };

    return {
      pendingReceived: state.pendingReceived.filter((r) => r.id !== id),
      friends: [...state.friends, newFriend],
      searchResults: updateResults(
        state.searchResults,
        (item) => item.friendshipId === id,
        (item) => ({ ...item, friendshipStatus: 'accepted' }),
      ),
    };
  };

const handleAddPending =
  (friendship: FriendshipPublic, wasAutoAccepted?: boolean) =>
  (state: SocialState): Partial<SocialState> => {
    if (wasAutoAccepted || friendship.status === 'accepted') {
      const newFriend: FriendshipPublic = {
        ...friendship,
        status: 'accepted',
      };

      return {
        friends: [...state.friends, newFriend],
        searchResults: updateResults(
          state.searchResults,
          (item) => item.id === friendship.userId,
          (item) => ({ ...item, friendshipStatus: 'accepted', friendshipId: friendship.id }),
        ),
      };
    }

    return {
      pendingSent: [...state.pendingSent, friendship],
      searchResults: updateResults(
        state.searchResults,
        (item) => item.id === friendship.userId,
        (item) => ({
          ...item,
          friendshipStatus: 'pending',
          friendshipId: friendship.id,
          senderId: state.currentUserId,
        }),
      ),
    };
  };

const handleRemoveFriend =
  (id: string) =>
  (state: SocialState): Partial<SocialState> => ({
    friends: state.friends.filter((f) => f.id !== id),
    searchResults: updateResults(
      state.searchResults,
      (item) => item.id === id || item.friendshipId === id,
      (item) => ({ ...item, friendshipStatus: 'none', friendshipId: null, senderId: null }),
    ),
  });

export function createSocialStore(initialData: SocialInitialData) {
  return createStore<SocialState>((set) => ({
    ...createInitialState(initialData),

    setFriends: (friends) => set({ friends }),
    setPendingReceived: (pendingReceived) => set({ pendingReceived }),
    setPendingSent: (pendingSent) => set({ pendingSent }),
    setSearchResults: (searchResults) => set({ searchResults }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setCurrentUserId: (currentUserId) => set({ currentUserId }),
    removeFriendById: (id) => set(handleRemoveFriend(id)),
    removePendingById: (list, id) => set(handleRemovePending(list, id)),
    acceptPendingById: (id) => set(handleAcceptPending(id)),
    addPendingRequest: (friendship, wasAutoAccepted) =>
      set(handleAddPending(friendship, wasAutoAccepted)),
  }));
}

export type SocialStore = ReturnType<typeof createSocialStore>;
