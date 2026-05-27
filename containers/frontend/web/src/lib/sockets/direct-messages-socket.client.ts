import { io, type Socket } from 'socket.io-client';

import { envPublic } from '@/lib/config/env.public';
import type {
  ClientToServerDirectMessageEvents,
  ServerToClientDirectMessageEvents,
} from '@/contracts/sockets/direct-messages/direct-messages.schema';

function createSocketUrl(pathname: string): string {
  const baseUrl = typeof window === 'undefined' ? envPublic.socketUrl : window.location.origin;
  return new URL(pathname, baseUrl).toString();
}

const directMessagesSocketUrl = createSocketUrl('/direct-messages');

export const directMessagesSocket: Socket<
  ServerToClientDirectMessageEvents,
  ClientToServerDirectMessageEvents
> = io(directMessagesSocketUrl, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
  auth: {},
});

export function disconnectDirectMessagesSocket() {
  if (directMessagesSocket.connected) {
    directMessagesSocket.disconnect();
  }
}
