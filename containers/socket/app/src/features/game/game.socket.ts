import type { Namespace, Socket } from 'socket.io';
import type { ClientToServerGameEvents, ServerToClientGameEvents } from '../../../contracts/sockets/game/game.schema';
import { initState, gameState, dijkstra, getAbility, initClientGameState, setClear, paint, addHistory, resetHistory, moveClone, nextPhase } from './utils';

const roles: string[] = ['assassin', 'paladin', 'mage', 'alchemist'];
const playerIds: string[] = [...roles].reverse();
const users: Record<string, string> = {};
const readyPlayers: string[] = [];
const activePlayers: string[] = [];


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function registerGameSocket(nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>) {

  function gsync() {
    const { tiles, mapBounds, clients, ...send } = gameState;
    const activePlayers = roles.filter((r) => !playerIds.includes(r));
    nsp.emit('game:server:globalSync', {
      ...send,
      readyPlayers,
      activePlayers,
    });
  }

  nsp.on('connection', (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
    if (playerIds.length === 4) {
      console.log('init state happens');
      const initstate = initState();
      gameState.players = initstate.players;
      gameState.enemies = initstate.enemies;
      gameState.tiles = initstate.tiles;
      gameState.mapBounds = initstate.mapBounds;
    }
    // WARN: DO NOT CHANGE, else will not render the map 
    nsp.emit('game:server:globalSync', gameState);
    const role = playerIds.pop();
    if (!role) {
      console.log('Room full, spectator joined:', socket.id);
      gameState.clients['spectator'] = initClientGameState(socket.id);
      gsync();
      socket.emit('game:server:join', 'spectator');
    }
    else {
      users[socket.id] = role;
      gameState.clients[role] = initClientGameState(socket.id);
      socket.emit('game:server:join', role);
      gsync();
      if (gameState.clients[role])
        socket.emit('game:server:sync', gameState.clients[role]);

      socket.on('game:client:showMoveRange', (diceValue: number) => {
        if (!gameState.clients[role] || !role)
          return;
        if (gameState.clients[role].selectedEnt.startsWith('clone_')
          && gameState.clones[`clone_${role}`].hasMoved === true)
          return (console.log(role, 'has already moved'));
        console.log('Received move range event with dice:',
          diceValue, 'for character', role);
        const selEnt = gameState.clients[role].selectedEnt;
        if (!selEnt)
          return;
        const ent = gameState.players[selEnt] || gameState.ghosts[selEnt]
          || gameState.enemies[selEnt] || gameState.clones[selEnt];
        if (!ent)
          return;
        const hlId = dijkstra(selEnt, ent.position, diceValue)
        const hlTiles: Record<string, boolean> = {};
        hlId.forEach((id: string) => (hlTiles[id] = true));
        setClear(role);
        gameState.clients[role].highlights = hlTiles;
        socket.emit('game:server:sync', gameState.clients[role]);
      });

      socket.on('game:client:displayMoveRange', (diceValue: number) => {
        if (!gameState.clients[role] || !role)
          return;
        if (gameState.clones[`clone_${role}`]?.hasMoved === true)
          return (console.log(role, 'has already moved'));
        console.log('Received move range event with dice:',
          diceValue, 'for character', role);
        const selEnt = gameState.clients[role].selectedEnt;
        if (selEnt?.replace("clone_", "") !== role)
          return;
        const ent = gameState.players[role] || gameState.clones[selEnt];
        if (!ent)
          return;
        const hlId = dijkstra(selEnt, ent.position, diceValue);
        const hlTiles: Record<string, boolean> = {};
        hlId.forEach((id: string) => (hlTiles[id] = true));
        gameState.clients[role].highlights = hlTiles;
        gameState.clients[role].selectedDice = diceValue;
        socket.emit('game:server:sync', gameState.clients[role])
      });

      socket.on('game:client:selectEntity', (id: string) => {
        if (!gameState.clients[role] || !role)
          return;
        setClear(role);
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

      socket.on('game:client:displayAbilityRange', (who: string, abName: string) => {
        if (!gameState.clients[role] || !role)
          return;
        const ent = gameState.players[who] || gameState.clones[who];
        if (!ent) return;
        console.log('Received ability range event for character', role);
        if (gameState.clients[role].selectedAb === abName)
          setClear(role);
        else {
          const ab = getAbility(abName);
          setClear(role);
          gameState.clients[role].selectedAb = abName;
          gameState.clients[role].selectables = paint(role, ent.position, ab.type, ab.range, ab.self);
          gameState.clients[role].canSelect = false;
          // WARN: not enough time :( 

          // if (ab.AoE)
          //   gameState.clients[role].selectables = paint(role, ent.position, ab.type, ab.range, ab.self);
        }
        socket.emit('game:server:sync', gameState.clients[role])
      });

      socket.on('game:client:showAbilityRange', (who: string, abName: string) => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received show ability range event for character', role);
        const ent = gameState.players[who] || gameState.clones[who];
        if (!ent) return;
        if (gameState.clients[role].selectedAb === abName)
          setClear(role);
        else {
          const { type, range, self } = getAbility(abName);
          gameState.clients[role].selectables = paint(role, ent.position, type, range, self);
        }
        socket.emit('game:server:sync', gameState.clients[role])
      });

      socket.on('game:client:clearHl', () => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received highlight clear event for character', users[socket.id]);
        gameState.clients[role].highlights = {};
        gameState.clients[role].selectedDice = null;
      });

      socket.on('game:client:clearSl', () => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received selectables clear event for character', users[socket.id]);
        gameState.clients[role].selectables = {};
        gameState.clients[role].selectedDice = null;
        gameState.clients[role].canSelect = true;
      });

      socket.on('game:client:clearSelDice', () => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('Received selected dice clear event for character', users[socket.id]);
        gameState.clients[role].selectedDice = null;
      });

      socket.on('game:client:moveClone', (tileId: string) => {
        console.log('Received move clone event for character', users[socket.id]);
        const client = gameState.clients[role];
        if (!client || !role || !tileId)
          return;
        if (!client.highlights[tileId] || !client.selectedEnt || !client.selectedDice)
          return;
        moveClone(role, tileId, client.selectedDice);
        setClear(role);
        socket.emit('game:server:sync', gameState.clients[role]);
        gsync();
      });

      socket.on('game:client:addHistoryAbility', (target: string) => {
        console.log('selected ent:', gameState.clients[role].selectedEnt);
        console.log('selected dice:', gameState.clients[role].selectedDice);
        console.log('selected ab:', gameState.clients[role].selectedAb);
        const entid = gameState.clients[role].selectedEnt;
        const seldice = gameState.clients[role].selectedDice;
        if (!entid || !seldice || !gameState.clients[role].selectedAb)
          return (console.log("couldn't add ability to history!"));
        addHistory(entid, "ability", target, seldice, gameState.clients[role].selectedAb);
        const source = gameState.players[entid] || gameState.clones[entid];
        if (source.type === "player") {
          setClear(role);
          gameState.players[entid] = {
            ...gameState.players[entid],
            dice: source.dice.toSpliced(source.dice.indexOf(seldice), 1),
            usedDice: [...source.usedDice, seldice].sort((a, b) => a - b),
          }
        }
        else if (source.type === "clone") {
          setClear(role);
          gameState.clones[entid].dice = source.dice.toSpliced(source.dice.indexOf(seldice), 1);
          gameState.clones[entid].usedDice = [...source.usedDice, seldice].sort((a, b) => a - b);
        }
        setClear(role);
        socket.emit('game:server:sync', gameState.clients[role]);
        gsync();
      });

      socket.on('game:client:toggleEndTurn', () => {
        if (!gameState.clients[role] || !role)
          return;
        if (readyPlayers.includes(role)) {
          setClear(role);
          readyPlayers.splice(readyPlayers.indexOf(role), 1);
          console.log('readyPlayers', readyPlayers);
        }
        else {
          readyPlayers.push(role);
          setClear(role);
          gameState.clients[role].selectedEnt = null;
          gameState.clients[role].canSelect = false;
          console.log('readyPlayers', readyPlayers);
        }
        socket.emit('game:server:sync', gameState.clients[role]);
        gsync();
      });

      socket.on('game:client:nextPhase', async () => {
        if (!gameState.clients[role] || !role)
          return;
        console.log('readyPlayers before nextphase', readyPlayers);
        if (readyPlayers.length === 4 - playerIds.length) {
          console.log('readyPlayers in nextphase', readyPlayers);
          readyPlayers.length = 0;
          await nextPhase(gsync);
          for (const id in gameState.clients) {
            setClear(id);
            socket.emit('game:server:sync', gameState.clients[id]);
          }
        }
      });

      socket.on('game:client:rClick', () => {
        setClear(role);
        socket.emit('game:server:sync', gameState.clients[role]);
      });

      socket.on('game:client:resetHistory', () => {
        resetHistory(role);
        gsync();
      });

      // INFO: helpers/debug

      socket.on('game:client:sync', () => {
        socket.emit('game:server:sync', gameState.clients[role]);
      });

      socket.on('game:client:globalSync', () => {
        gsync();
      });
    }

    socket.on('disconnect', () => {
      if (role) {
        playerIds.push(role);
        delete users[socket.id];
        console.log(role, 'disconnected, role', playerIds[playerIds.length - 1], 'is available again.');
        gsync();
      }
    });
  })
}
