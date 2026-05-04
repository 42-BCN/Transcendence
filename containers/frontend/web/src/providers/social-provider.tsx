'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';

import {
  createInitialState,
  createSocialStore,
  type SocialStore,
} from '@/features/social/store/social-store';
import type { SocialInitialData, SocialState } from '@/features/social/store/social-store.types';

const SocialStoreContext = createContext<SocialStore | null>(null);

export function SocialProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: SocialInitialData;
}) {
  const storeRef = useRef<SocialStore | null>(null);
  const currentUserIdRef = useRef<string | null>(initialData.currentUserId);

  if (!storeRef.current) {
    storeRef.current = createSocialStore(initialData);
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    if (currentUserIdRef.current !== initialData.currentUserId) {
      store.setState(createInitialState(initialData));
      currentUserIdRef.current = initialData.currentUserId;
    }
  }, [initialData]);

  return (
    <SocialStoreContext.Provider value={storeRef.current}>{children}</SocialStoreContext.Provider>
  );
}

export function useSocialStore<T>(selector: (state: SocialState) => T): T {
  const store = useContext(SocialStoreContext);

  if (!store) {
    throw new Error('useSocialStore must be used inside SocialProvider');
  }

  return useStore(store, selector);
}
