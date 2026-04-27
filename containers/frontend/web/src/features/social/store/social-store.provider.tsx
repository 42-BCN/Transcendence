'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';

import { createSocialStore, type SocialStore } from './social-store';
import type { SocialInitialData, SocialState } from './social-store.types';

const SocialStoreContext = createContext<SocialStore | null>(null);

export function SocialStoreProvider({
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
    throw new Error('useSocialStore must be used inside SocialStoreProvider');
  }

  return useStore(store, selector);
}
