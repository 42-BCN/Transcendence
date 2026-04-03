import type { Namespace, Server, Socket } from 'socket.io';

let friendsNsp: Namespace | null = null;

/** userId -> number of active /friends connections that identified as that user */
const onlineCounts = new Map<string, number>();

export function registerFriendsSocket(io: Server) {
  const nsp = io.of('/friends');
  friendsNsp = nsp;

  nsp.on('connection', (socket: Socket) => {
    let currentUserId: string | null = null;

    socket.on('friends:identify', (userId: unknown) => {
      if (typeof userId !== 'string' || userId.length === 0) return;

      if (currentUserId === userId) {
        void socket.join(`user:${userId}`);
        return;
      }

      if (currentUserId) {
        decrementOnline(currentUserId);
      }

      currentUserId = userId;
      incrementOnline(userId);
      void socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      if (currentUserId) {
        decrementOnline(currentUserId);
        currentUserId = null;
      }
    });
  });
}

function incrementOnline(userId: string) {
  onlineCounts.set(userId, (onlineCounts.get(userId) ?? 0) + 1);
}

function decrementOnline(userId: string) {
  const next = (onlineCounts.get(userId) ?? 1) - 1;
  if (next <= 0) onlineCounts.delete(userId);
  else onlineCounts.set(userId, next);
}

export function emitToUser(userId: string, event: string, payload: unknown): void {
  friendsNsp?.to(`user:${userId}`).emit(event, payload);
}

export function getUsersOnlineStatus(userIds: string[]): Record<string, boolean> {
  const status: Record<string, boolean> = {};
  for (const id of userIds) {
    status[id] = (onlineCounts.get(id) ?? 0) > 0;
  }
  return status;
}
