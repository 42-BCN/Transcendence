'use client';

import type { LogoutRes } from '@/contracts/api/auth/auth.contract';
import { fetchClient } from '@/lib/http/fetcher.client';
import { disconnectFriendsSocket } from '@/lib/sockets/friends-socket.client';
import { notifyAuthChanged } from '@/lib/sockets/realtime-session-bridge';

export async function logoutAction(): Promise<LogoutRes> {
  try {
    const result = await fetchClient<LogoutRes>('/api/auth/logout', 'POST', undefined, {
      withAuth: true,
    });

    notifyAuthChanged();
    return result.data;
  } finally {
    disconnectFriendsSocket();
  }
}
