'use client';

import { createContext, useContext, type ReactNode } from 'react';

const CurrentUserContext = createContext<string | null>(null);

export function CurrentUserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: string | null;
}) {
  return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const user = useContext(CurrentUserContext);

  return user;
}
