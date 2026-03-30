'use client';

import { createContext, useContext, type ReactNode } from 'react';

type NavigationContextValue = {
  locale: string;
  isExpanded: boolean;
  toggleExpanded: () => void;
  closeDrawer: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

type NavigationProviderProps = {
  value: NavigationContextValue;
  children: ReactNode;
};

export function NavigationProvider({ value, children }: NavigationProviderProps) {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }

  return context;
}
