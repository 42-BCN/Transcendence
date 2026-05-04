import { createStore } from 'zustand/vanilla';

import { createSocialActions, emptyGroupedSearchResults } from './social-store.reducers';
import type { SocialInitialData, SocialState } from './social-store.types';

const createInitialState = (initialData: SocialInitialData) => ({
  friends: initialData.friends.map((f) => ({
    ...f,
    presence: (f as any).presence ?? 'offline',
  })),
  pendingReceived: initialData.pendingReceived,
  pendingSent: initialData.pendingSent,
  currentUserId: initialData.currentUserId,
  searchResults: emptyGroupedSearchResults(),
  searchQuery: '',
});

export function createSocialStore(initialData: SocialInitialData) {
  return createStore<SocialState>((set) => ({
    ...createInitialState(initialData),
    ...createSocialActions(set),
  }));
}

export type SocialStore = ReturnType<typeof createSocialStore>;
