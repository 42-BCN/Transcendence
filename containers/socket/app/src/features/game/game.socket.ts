import type { Namespace, Socket } from 'socket.io';
import type { ClientToServerGameEvents, ServerToClientGameEvents } from '../../../contracts/sockets/game/game.schema';
import { initState, gameState, dijkstra, getAbility, initClientGameState, paint } from './utils';

const playerIds: string[] = ['assassin', 'paladin', 'mage', 'alchemist'].reverse();
const users: Record<string, string> = {};

export function registerGameSocket(nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>) {
  nsp.on('connection', (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
    if (playerIds.length === 4) {
      console.log('init state happens');
      const initstate = initState();
      gameState.players = initstate.players;
      gameState.enemies = initstate.enemies;
      gameState.tiles = initstate.tiles;
      gameState.mapBounds = initstate.mapBounds;
    }
    socket.emit('game:server:globalSync', gameState)
    const role = playerIds.pop();
    if (!role) {
      console.log('Room full, spectator joined:', socket.id);
      gameState.clients['spectator'] = initClientGameState(socket.id);
      socket.emit('game:server:join', 'spectator');
    }
    else {
      users[socket.id] = role;
      console.log('Emitted join server event with role:', role);
      gameState.clients[role] = initClientGameState(socket.id);
      socket.emit('game:server:join', role);
      socket.on('game:client:displayMoveRange', (diceValue: number) => {
        if (!gameState.clients[role] || !role)
          return;
        if (gameState.players[role].hasMoved === true)
          return (console.log(role, 'has already moved'));
        console.log('Received move range event with dice:',
          diceValue, 'for character', role);
        gameState.clients[role].selectedDice = diceValue;
        const hlId = dijkstra(gameState.players[role].position, diceValue)
        const hlTiles: Record<string, boolean> = {};
        hlId.forEach((id: string) => (hlTiles[id] = true));
        gameState.clients[role].highlights = hlTiles;
        socket.emit('game:server:sync', gameState.clients[role])
      });
      socket.on('game:client:selectEntity', (id: string) => {
        if (!gameState.clients[role] || !role)
          return;
        gameState.clients[role].canSelect = true;
        gameState.clients[role].selectedAb = null;
        gameState.clients[role].selectedDice = null;
        gameState.clients[role].highlights = {};
        gameState.clients[role].selectables = {};
        gameState.clients[role].selectedEnt =
          (id === gameState.clients[role].selectedEnt) ? null : id;
        socket.emit('game:server:sync', gameState.clients[role])
      })
      socket.on('game:client:selectDice', (diceValue: number) => {
        gameState.clients[role].selectedDice =
          (gameState.clients[role].selectedDice === diceValue
            || !gameState.clients[role].selectedEnt) ? null : diceValue;
        socket.emit('game:server:sync', gameState.clients[role])
      });
      socket.on('game:client:displayAbilityRange', (abName: string) => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received ability range event for character', role);
        if (gameState.clients[role].selectedAb === abName) {
          gameState.clients[role].selectedAb = null;
          gameState.clients[role].selectedDice = null;
          gameState.clients[role].highlights = {};
          gameState.clients[role].selectables = {};
          gameState.clients[role].canSelect = true;
        }
        else {
          const { type, range, self } = getAbility(abName);
          gameState.clients[role].selectedAb = abName;
          gameState.clients[role].selectedDice = null;
          gameState.clients[role].highlights = {};
          gameState.clients[role].selectables = paint(role, gameState.players[role].position, type, range, self);
          gameState.clients[role].canSelect = false;
        }
        socket.emit('game:server:sync', gameState.clients[role])
      });
      socket.on('game:client:showAbilityRange', (abName: string) => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received show ability range event for character', role);
        if (gameState.clients[role].selectedAb === abName) {
          gameState.clients[role].selectables = {};
        }
        else {
          const { type, range, self } = getAbility(abName);
          gameState.clients[role].selectables = paint(role, gameState.players[role].position, type, range, self);
        }
        socket.emit('game:server:sync', gameState.clients[role])
      });
      socket.on('game:client:clearHl', () => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received highlight clear event for character', users[socket.id]);
        gameState.clients[role].highlights = {};
      });
      socket.on('game:client:clearSl', () => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received selectables clear event for character', users[socket.id]);
        gameState.clients[role].selectables = {};
      });
      socket.on('game:client:moveClone', (diceValue: number) => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received move range event with dice:', diceValue,
          'for character', users[socket.id]);
        const hlId = dijkstra(gameState.players[users[socket.id]].position, diceValue)
        const hlTiles: Record<string, boolean> = {};
        hlId.forEach((id: string) => (hlTiles[id] = true));
        gameState.clients[role].highlights = hlTiles;
        socket.emit('game:server:sync', gameState.clients[role])
      });
    }
    socket.on('disconnect', () => {
      if (role) {
        playerIds.push(role);
        delete users[socket.id];
        delete gameState.clients[role]
        console.log(role, 'disconnected, role', playerIds[playerIds.length - 1], 'is available again.');
      }

    });
  });
  }
