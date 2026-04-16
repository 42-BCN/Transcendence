import type { Namespace, Socket } from 'socket.io';

let friendsNsp: Namespace | null = null;

/** userId -> number of active /friends connections that identified as that user */
const onlineCounts = new Map<string, number>();

export function registerFriendsSocket(nsp: Namespace) {
  friendsNsp = nsp;

  nsp.on('connection', (socket: Socket) => {
    const currentUserId = socket.data.userId;

    if (typeof currentUserId !== 'string' || currentUserId.length === 0) {
      socket.disconnect(true);
      return;
    }

    incrementOnline(currentUserId);
    void socket.join(`user:${currentUserId}`);

    socket.on('disconnect', () => {
      decrementOnline(currentUserId);
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
