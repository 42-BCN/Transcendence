import { create } from 'zustand';
import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';

export type PendingListKey = 'pendingReceived' | 'pendingSent';

interface SocialState {
  friends: FriendPublic[];
  pendingReceived: FriendshipPublic[];
  pendingSent: FriendshipPublic[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setFriends: (friends: FriendPublic[]) => void;
  setPendingReceived: (requests: FriendshipPublic[]) => void;
  setPendingSent: (requests: FriendshipPublic[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  removePendingById: (list: PendingListKey, id: string) => void;

  // setOptimisticReject: (id) => ()
}

export const useSocialStore = create<SocialState>((set) => ({
  friends: [],
  pendingReceived: [],
  pendingSent: [],
  isLoading: false,
  error: null,

  setFriends: (friends) => set({ friends }),
  setPendingReceived: (pendingReceived) => set({ pendingReceived }),
  setPendingSent: (pendingSent) => set({ pendingSent }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  removePendingById: (list, id) =>
    set((state) => ({
      [list]: state[list].filter((item) => item.id !== id),
    })),
}));
