'use client';

import type { LogoutRes } from '@/contracts/api/auth/auth.contract';
import { fetchClient } from '@/lib/http/fetcher.client';
import { disconnectFriendsSocket } from '@/lib/sockets/friends-socket.client';

export async function logoutAction(): Promise<LogoutRes> {
  try {
    const result = await fetchClient('/api/auth/logout', 'POST', undefined, {
      withAuth: true,
    });

    return result.data;
  } finally {
    disconnectFriendsSocket();
  }
}
