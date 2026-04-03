import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import {
  handleInternalNotify,
  handlePresenceCheck,
} from "./internal/notify.routes";
import { registerSockets } from "./sockets/socket.register";

const app = express();
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

registerSockets(io);

app.post("/internal/notify", handleInternalNotify);
app.post("/internal/presence", handlePresenceCheck);

httpServer.listen(3100, () => {
  console.log("Socket.IO server + internal notify on :3100");
});
