import type { Server } from "socket.io";

import { registerFriendsSocket } from "../features/friends.socket";
import { registerChatSocket } from "../features/chat.socket";
import { registerRobotsSocket } from "../features/robots.socket";

export function registerSockets(io: Server) {
  registerFriendsSocket(io);
  registerRobotsSocket(io.of("/robots"));
  registerChatSocket(io.of("/chat"));
}
