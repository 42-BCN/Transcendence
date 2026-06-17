'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { broadcastAuthChangedForIdentity } from '@/lib/sockets/realtime-session-bridge';

const CurrentUserContext = createContext<string | null>(null);

export function CurrentUserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: string | null;
}) {
  useEffect(() => {
    if (!user) {
      return;
    }

    broadcastAuthChangedForIdentity(`user:${user}`);
  }, [user]);

  return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const user = useContext(CurrentUserContext);

  return user;
}
