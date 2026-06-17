'use client';

import type { LogoutRes } from '@/contracts/api/auth/auth.contract';
import { fetchClient } from '@/lib/http/fetcher.client';
import { disconnectFriendsSocket } from '@/lib/sockets/friends-socket.client';
import {
  clearAuthBroadcastIdentity,
  notifyAuthChanged,
} from '@/lib/sockets/realtime-session-bridge';
import { resetChatSessionIdentity, setGuestSessionBootstrapEnabled } from '@/lib/sockets/socket';

export async function logoutAction(): Promise<LogoutRes> {
  try {
    setGuestSessionBootstrapEnabled(false);
    resetChatSessionIdentity();
    const result = await fetchClient<LogoutRes>('/api/auth/logout', 'POST', undefined, {
      withAuth: true,
    });

    clearAuthBroadcastIdentity();
    notifyAuthChanged();
    return result.data;
  } finally {
    disconnectFriendsSocket();
  }
}
