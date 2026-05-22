'use client';

import type { ReactNode } from 'react';
import type { FriendPublic } from '@/contracts/api/friendships/friendships.contracts';
import { MessagesList } from './messages-list';

type MessagesLayoutProps = {
  friends: FriendPublic[];
  selectedUsername?: string;
  children: ReactNode;
};

export function MessagesLayout({ friends, selectedUsername, children }: MessagesLayoutProps) {
  return (
    <div className="pointer-events-auto flex w-full min-w-0 flex-1 h-[100dvh] overflow-hidden">
      <div className="flex min-h-0 w-[400px] shrink-0 overflow-hidden ml-8">
        <MessagesList friends={friends} selectedUsername={selectedUsername} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
