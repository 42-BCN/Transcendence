import type { Namespace, Server } from "socket.io";

let friendsNsp: Namespace | null = null;

export function registerFriendsSocket(io: Server) {
  const nsp = io.of("/friends");
  friendsNsp = nsp;

  nsp.on("connection", (socket) => {
    socket.on("friends:identify", (userId: unknown) => {
      if (typeof userId === "string" && userId.length > 0) {
        void socket.join(`user:${userId}`);
      }
    });
  });
}

export function emitToUser(
  userId: string,
  event: string,
  payload: unknown,
): void {
  friendsNsp?.to(`user:${userId}`).emit(event, payload);
}
