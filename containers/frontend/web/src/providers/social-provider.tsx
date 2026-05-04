'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { createSocialStore, type SocialStore } from '@/features/social/store/social-store';
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

  if (!storeRef.current) {
    storeRef.current = createSocialStore(initialData);
  }

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
