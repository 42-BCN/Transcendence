import type { Namespace, Socket } from 'socket.io';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/rooms/gameRooms.schema';
import {
  decrementGameRoomConnection,
  gameRoomsManager,
  getRoomMemberKey,
  incrementGameRoomConnection,
} from './gameRooms.shared';

//interface Client

//  really important:
//    socket.data.identityKey is the same as a user id for me.
//    socket.data.username is the same as a nickname or username for me.


//  some helper functions.

function  setEmtyGameRoomState(socket: Socket) {
  socket.nsp.to(socket.id).emit("gameRoom:room:update", {
    id: 0, 
    isGameRoomFull: false, 
    teammates: [],
  });
}

function  updateGameRoomState(socket: Socket) {
  const roomMemberKey = getRoomMemberKey(socket);
  if (!roomMemberKey) {
    setEmtyGameRoomState(socket);
    return ;
  }
  const gameRoom = gameRoomsManager.getUserCurrentGameRoom(roomMemberKey);
  if (gameRoom === "error:no_assigned_room") {
    setEmtyGameRoomState(socket);
    return ;
  }
  if (typeof gameRoom === "string") {
    socket.nsp.to(socket.id)
      .emit("gameRoom:error:msg", "something has gone wrong try again later.");
    return ;
  }
  socket.nsp.to(socket.id).emit("gameRoom:room:update", gameRoom);
  socket.join("GameRoom-" + gameRoom.id.toString());
}


//  all the server acctions.

export function registerGameRoomSocket(
  nsp: Namespace
) {
  nsp.on('connection', (socket: Socket) => {
    const roomMemberKey = incrementGameRoomConnection(socket);
    const username = socket.data.username;

    if (!roomMemberKey || typeof username !== "string" || username.length === 0) {
      socket.disconnect(true);
      return ;
    }

    updateGameRoomState(socket);
    socket.nsp.to(socket.id).emit("gameRoom:debug:msg", "first connection");
    socket.nsp.to(socket.id).emit("gameRoom:error:msg", "none");
    
    console.log("=========================================================");
    console.log("[ GameRoom ] new socket connection: ");
    console.log("\t-->\tsocket id:", socket.id);
    console.log("\t-->\tsocket user id:", roomMemberKey);
    console.log("\t-->\tsocket user name:", username);
    console.log("=========================================================");

    

    socket.on("gameRoom:teammate:joinAny", () => {
      console.log("");
      console.log("[ GameRoom ] request to join any room: ");
      console.log("\t-->\tsocket id:", socket.id);
      console.log("\t-->\tsocket user id:", roomMemberKey);
      console.log("\t-->\tsocket user name:", username);
      console.log("");
      const gameRoom = gameRoomsManager.joinUserToAnyGameRoom(roomMemberKey, username);
      //  check for returned errors.
      if (gameRoom === "error:alredy_joined_another_room") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", "alredy in a room.");
        updateGameRoomState(socket);
        return ;
      }
      if (typeof gameRoom == "string") {
        socket.nsp.to(socket.id)
          .emit("gameRoom:error:msg", "something has gone wrong try again later.");
        return ;
      }
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:joined", username);
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:update", gameRoom);
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.nsp.to(socket.id).emit("gameRoom:room:update", gameRoom);
    });
 


    socket.on("gameRoom:teammate:join", (gameRoomId: number) => {
      console.log("");
      console.log("[ GameRoom ] request to joim ", gameRoomId, " :");
      console.log("\t-->\tsocket id:", socket.id);
      console.log("\t-->\tsocket user id:", roomMemberKey);
      console.log("\t-->\tsocket user name:", username);
      console.log("");

      const gameRoom = gameRoomsManager.joinUserToGameRoom(
        roomMemberKey,
        username,
        gameRoomId
      );
      if (gameRoom === "error:alredy_joined_another_room") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", "alredy in a room.");
        updateGameRoomState(socket);
        return ;
      }
      if (gameRoom === "error:invalid_room_id") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", "inexistent room");
        updateGameRoomState(socket);
        return ;
      }
      if (typeof gameRoom === "string") {
        socket.nsp.to(socket.id)
          .emit("gameRoom:error:msg", "something has gone wrong try again later.");
        return ;
      }
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:joined", username);
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:update", gameRoom);
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.nsp.to(socket.id).emit("gameRoom:room:update", gameRoom);
    });



    socket.on("gameRoom:teammate:leave", () => {
      console.log("");
      console.log("[ GameRoom ] request to leave: ");
      console.log("\t-->\tsocket id:", socket.id);
      console.log("\t-->\tsocket user id:", roomMemberKey);
      console.log("\t-->\tsocket user name:", username);
      console.log("");
      const gameRoom = gameRoomsManager.removeUserFromGameRoom(roomMemberKey);
      //  check for returned errors.
      if (gameRoom === "error:no_assigned_room") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", "not on any room.");
        setEmtyGameRoomState(socket);
      }
      if (typeof gameRoom == "string") {
        socket.nsp.to(socket.id)
          .emit("gameRoom:error:msg", "something has gone wrong try again later.");
        return ;
      }
      const gameRoomId = gameRoom.id;
      socket.leave("GameRoom-" + gameRoomId.toString());
      socket.to("GameRoom-" + gameRoomId.toString())
        .emit("gameRoom:room:left", username);
      socket.to("GameRoom-" + gameRoomId.toString())
        .emit("gameRoom:room:update", gameRoom);

      setEmtyGameRoomState(socket);
      socket.nsp.to(socket.id).emit("gameRoom:debug:msg", "left room");
    });
    
    

    socket.on("gameRoom:teammate:printDebug", () => {
      console.log("");
      console.log("[ GameRoom ] request to print debug info: ");
      console.log("");
      gameRoomsManager.printInfo();

      updateGameRoomState(socket);
    });

    socket.on("disconnect", () => {
      const connectionState = decrementGameRoomConnection(socket);
      if (!connectionState || connectionState.hasActiveConnections) {
        return;
      }

      const gameRoom = gameRoomsManager.removeUserFromGameRoom(connectionState.roomMemberKey);

      if (typeof gameRoom === "string") {
        return;
      }

      socket.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:left", username);
      socket.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:update", gameRoom);
    });
  });
}


//  really important:
//    socket.data.identityKey is the same as a user id for me.
//    socket.data.username is the same as a nickname or username for me.
