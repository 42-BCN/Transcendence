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

  // Actions
  setFriends: (friends: FriendPublic[]) => void;
  setPendingReceived: (requests: FriendshipPublic[]) => void;
  setPendingSent: (requests: FriendshipPublic[]) => void;
  setSearchResults: (results: SearchUserResult[]) => void;
  removePendingById: (list: PendingListKey, id: string) => void;
  acceptPendingById: (id: string) => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  friends: [],
  pendingReceived: [],
  pendingSent: [],
  searchResults: [],

  setFriends: (friends) => set({ friends }),
  setPendingReceived: (pendingReceived) => set({ pendingReceived }),
  setPendingSent: (pendingSent) => set({ pendingSent }),
  setSearchResults: (searchResults) => set({ searchResults }),

  removePendingById: (list, id) =>
    set((state) => ({
      [list]: state[list].filter((item) => item.id !== id),
    })),

  acceptPendingById: (id) =>
    set((state) => {
      const request = state.pendingReceived.find((r) => r.id === id);
      if (!request) return state;

      const newFriend: FriendPublic = {
        id: request.userId,
        username: request.username,
        avatar: request.avatar,
        isOnline: false, //pending
      };

      return {
        pendingReceived: state.pendingReceived.filter((r) => r.id !== id),
        friends: [...state.friends, newFriend],
      };
    }),
}));
