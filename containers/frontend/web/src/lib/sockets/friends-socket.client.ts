// TODO after merge game sockets see how to structure this directory. group by domain or by socket type (managers, clients, etc.)
import { io, type Socket } from 'socket.io-client';

import type {
  ClientToServerFriendshipEvents,
  ServerToClientFriendshipEvents,
} from '@/contracts/sockets/friendships/friendships.schema';
import { envPublic } from '@/lib/config/env.public';

const friendsSocketUrl = new URL('/friends', envPublic.socketUrl).toString();

export const friendsSocket: Socket<ServerToClientFriendshipEvents, ClientToServerFriendshipEvents> =
  io(friendsSocketUrl, {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
  });

export function disconnectFriendsSocket() {
  if (friendsSocket.connected) {
    friendsSocket.disconnect();
  }
}
