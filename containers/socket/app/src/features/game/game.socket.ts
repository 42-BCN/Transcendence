import type { Namespace, Socket } from 'socket.io';
import type {
  ClientToServerGameEvents,
  ServerToClientGameEvents as ContractServerToClientGameEvents,
} from '@contracts/sockets/game/game.schema';

import { gameSessionManager } from './GameSessionManager';
import type { GameSession, PlayerRole } from './game-session.types';
import {
  addHistory,
  applyPlanningDisplace,
  applyPlanningStatus,
  checkEnt,
  dijkstra,
  getAbility,
  getAoE,
  initClientGameState,
  moveClone,
  nextPhase,
  nextVfxId,
  paint,
  resetHistory,
  runWithGameState,
  setClear,
} from './utils';
import {
  gameRoomsManager,
  getRoomMemberKey,
  getUserGameRoom,
} from '../game-room/gameRooms.shared';
import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';
import type { clientGameState, serverGameState, vfx as VfxPayload } from './types';

type ServerGlobalSyncPayload = Omit<serverGameState, 'clients' | 'tiles' | 'mapBounds'> & {
  tiles?: serverGameState['tiles'];
  mapBounds?: serverGameState['mapBounds'];
  readyPlayers?: string[];
  activePlayers?: string[];
};

type ServerToClientGameEvents = Omit<
  ContractServerToClientGameEvents,
  'game:server:globalSync'
> & {
  'game:server:globalSync': (state: ServerGlobalSyncPayload) => void;
  'game:server:sync': (state: clientGameState) => void;
  'game:server:vfx': (effect: VfxPayload) => void;
  'game:server:error': (message: string) => void;
};

function getSessionPlayerRoleCount(session: GameSession) {
  return [...session.players.values()].filter((player) => player.role !== 'spectator').length;
}

function getActivePlayerRoles(session: GameSession) {
  return [...session.players.values()]
    .filter((player) => player.role !== 'spectator' && player.status === 'connected')
    .map((player) => player.role as PlayerRole);
}

function getClientKey(role: PlayerRole | 'spectator', memberKey: string) {
  return role === 'spectator' ? `spectator:${memberKey}` : role;
}

function getPlayerClientState(session: GameSession, role: PlayerRole | 'spectator', memberKey: string) {
  return session.state.clients[getClientKey(role, memberKey)];
}

function gsync(
  nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>,
  session: GameSession,
) {
  const { tiles, mapBounds, clients, ...send } = session.state;
  nsp.to(session.channel).emit('game:server:globalSync', {
    ...send,
    readyPlayers: [...session.readyPlayers],
    activePlayers: getActivePlayerRoles(session),
  });
}

function syncFullGlobalState(
  socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>,
  session: GameSession,
) {
  socket.emit('game:server:globalSync', {
    ...session.state,
    readyPlayers: [...session.readyPlayers],
    activePlayers: getActivePlayerRoles(session),
  });
}

function vfx(
  nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>,
  session: GameSession,
  effect: VfxPayload,
) {
  nsp.to(session.channel).emit('game:server:vfx', effect);
}

function syncClient(
  socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>,
  session: GameSession,
  role: PlayerRole | 'spectator',
  memberKey: string,
) {
  const clientState = getPlayerClientState(session, role, memberKey);
  if (clientState) {
    socket.emit('game:server:sync', clientState);
  }
}

function syncAllClients(
  nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>,
  session: GameSession,
) {
  for (const player of session.players.values()) {
    if (player.status !== 'connected') {
      continue;
    }
    const clientState = getPlayerClientState(session, player.role, player.memberKey);
    if (clientState) {
      nsp.to(player.socketId).emit('game:server:sync', clientState);
    }
  }
}

function attachPlayerToSession(
  session: GameSession,
  memberKey: string,
  socketId: string,
) {
  const existing = session.players.get(memberKey);
  if (existing) {
    existing.socketId = socketId;
    existing.status = existing.role === 'spectator' ? 'spectator' : 'connected';
    const clientKey = getClientKey(existing.role, memberKey);
    session.state.clients[clientKey] ??= initClientGameState(socketId);
    return existing;
  }

  const role = session.availableRoles.pop() ?? 'spectator';
  const player = {
    memberKey,
    role,
    socketId,
    status: role === 'spectator' ? 'spectator' : 'connected',
  } as const;

  session.players.set(memberKey, { ...player });
  const clientKey = getClientKey(role, memberKey);
  session.state.clients[clientKey] = initClientGameState(socketId);
  return session.players.get(memberKey)!;
}

function releasePlayerRole(session: GameSession, memberKey: string) {
  const player = session.players.get(memberKey);
  if (!player) {
    return;
  }

  session.players.delete(memberKey);

  if (player.role !== 'spectator') {
    session.readyPlayers.delete(player.role);
    if (!session.availableRoles.includes(player.role)) {
      session.availableRoles.push(player.role);
    }
  }

  delete session.state.clients[getClientKey(player.role, memberKey)];
}

function reconcileSessionWithRoom(session: GameSession, gameRoom: gameRoomState) {
  const currentMemberKeys = new Set(gameRoom.teammates.map((teammate) => teammate.userId));

  for (const memberKey of [...session.players.keys()]) {
    if (!currentMemberKeys.has(memberKey)) {
      releasePlayerRole(session, memberKey);
    }
  }
}

async function withSessionState<T>(session: GameSession, operation: () => Promise<T> | T) {
  return runWithGameState(session.state, operation);
}

gameRoomsManager.setOnRoomDeleted((roomId) => {
  gameSessionManager.deleteSession(roomId);
});

export function registerGameSocket(nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>) {
  nsp.on('connection', async (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
    const memberKey = getRoomMemberKey(socket);
    const gameRoom = getUserGameRoom(socket);

    if (!memberKey || !gameRoom) {
      (socket as any).emit('game:server:error', 'No active game room for this socket.');
      socket.disconnect(true);
      return;
    }

    if (!gameRoom.isGameRoomFull) {
      (socket as any).emit('game:server:error', 'Game is only available when the room is full.');
      socket.disconnect(true);
      return;
    }

    const session = gameSessionManager.getOrCreateSession(gameRoom);
    reconcileSessionWithRoom(session, gameRoom);
    const sessionPlayer = attachPlayerToSession(session, memberKey, socket.id);
    const role = sessionPlayer.role;

    await socket.join(session.channel);
    socket.emit('game:server:join', role);
    syncFullGlobalState(socket, session);
    gsync(nsp, session);
    syncClient(socket, session, role, memberKey);

    socket.on('game:client:showMoveRange', async (diceValue: number) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client || role === 'spectator' || !client.selectedEnt)
          return;
        const selectedEnt = client.selectedEnt;
        if (selectedEnt === `clone_${role}` && session.state.clones[`clone_${role}`]?.hasMoved === true)
          return;
        const ent = session.state.players[selectedEnt] || session.state.ghosts[selectedEnt]
          || session.state.enemies[selectedEnt] || session.state.clones[selectedEnt];
        if (!ent)
          return;
        const hlId = dijkstra(selectedEnt, ent.position, diceValue);
        const hlTiles: Record<string, boolean> = {};
        hlId.forEach((id: string) => (hlTiles[id] = true));
        setClear(getClientKey(role, memberKey));
        client.highlights = hlTiles;
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:resetGame', async () => {
      if (role === 'spectator')
        return;
      if (session.state.phase !== 'WIN' && session.state.phase !== 'LOSE')
        return;
      gameSessionManager.resetSession(session.roomId);
      for (const [mk, player] of session.players.entries()) {
        if (player.status !== 'connected')
          continue;
        const clientKey = getClientKey(player.role, mk);
        session.state.clients[clientKey] = initClientGameState(player.socketId);
      }
      for (const player of session.players.values()) {
        if (player.status !== 'connected')
          continue;
        nsp.to(player.socketId).emit('game:server:globalSync' as any, {
          ...session.state,
          readyPlayers: [...session.readyPlayers],
          activePlayers: getActivePlayerRoles(session),
        });
        const clientState = getPlayerClientState(session, player.role, player.memberKey);
        if (clientState) {
          nsp.to(player.socketId).emit('game:server:sync', clientState);
        }
      }
    });

    socket.on('game:client:displayMoveRange', async (diceValue: number) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client || role === 'spectator')
          return;
        if (session.state.clones[`clone_${role}`]?.hasMoved === true)
          return;
        const selEnt = client.selectedEnt;
        if (selEnt?.replace('clone_', '') !== role)
          return;
        const ent = session.state.players[role] || session.state.clones[selEnt];
        if (!ent)
          return;
        const hlId = dijkstra(selEnt, ent.position, diceValue);
        const hlTiles: Record<string, boolean> = {};
        hlId.forEach((id: string) => (hlTiles[id] = true));
        client.highlights = hlTiles;
        client.selectedDice = diceValue;
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:selectEntity', async (id: string) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        setClear(getClientKey(role, memberKey));
        client.selectedEnt = id === client.selectedEnt ? null : id;
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:selectDice', async (diceValue: number) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        client.selectedDice = (client.selectedDice === diceValue || !client.selectedEnt) ? null : diceValue;
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:displayAbilityRange', async (who: string, abName: string) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        if (who.replace('clone_', '') !== role)
          return;
        const ent = session.state.players[who] || session.state.clones[who] || session.state.enemies[who];
        if (!ent)
          return;
        if (client.selectedAb === abName) {
          setClear(getClientKey(role, memberKey));
        } else {
          const ab = getAbility(abName);
          setClear(getClientKey(role, memberKey));
          client.selectedAb = abName;
          client.selectables = paint(role, ent.position, ab.type, ab.range, ab.self);
          client.canSelect = false;
        }
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:showAbilityRange', async (who: string, abName: string) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        if (who.replace('clone_', '') !== role)
          return;
        const ent = session.state.players[who] || session.state.clones[who] || session.state.enemies[who];
        if (!ent)
          return;
        if (client.selectedAb === abName) {
          setClear(getClientKey(role, memberKey));
        } else {
          const { type, range, self } = getAbility(abName);
          client.selectables = paint(role, ent.position, type, range, self);
        }
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:clearHl', async () => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        client.highlights = {};
        client.selectedDice = null;
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:clearSl', async () => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        client.selectables = {};
        client.selectedDice = null;
        client.canSelect = true;
      });
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:clearSelDice', async () => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        client.selectedDice = null;
      });
    });

    socket.on('game:client:moveClone', async (tileId: string) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client || role === 'spectator' || !tileId)
          return;
        if (!client.highlights[tileId] || !client.selectedEnt || !client.selectedDice)
          return;
        moveClone(role, tileId, client.selectedDice);
        client.selectedEnt = `clone_${role}`;
        setClear(getClientKey(role, memberKey));
      });
      syncClient(socket, session, role, memberKey);
      gsync(nsp, session);
    });

    socket.on('game:client:addHistoryAbility', async (target: string) => {
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        const entid = client.selectedEnt;
        const seldice = client.selectedDice;
        const abName = client.selectedAb;
        if (!entid || !seldice || !abName)
          return;
        const abilityActionId = addHistory(entid, 'ability', target, seldice, abName);
        const source = session.state.players[entid] || session.state.clones[entid];
        if (!source)
          return;
        if (source.type === 'player') {
          setClear(getClientKey(role, memberKey));
          session.state.players[entid] = {
            ...session.state.players[entid],
            dice: source.dice.toSpliced(source.dice.indexOf(seldice), 1),
            usedDice: [...source.usedDice, seldice].sort((a, b) => a - b),
          };
        } else if (source.type === 'clone') {
          setClear(getClientKey(role, memberKey));
          session.state.clones[entid].dice = source.dice.toSpliced(source.dice.indexOf(seldice), 1);
          session.state.clones[entid].usedDice = [...source.usedDice, seldice].sort((a, b) => a - b);
        }
        if (abilityActionId) {
          const ab = getAbility(abName);
          if (ab.effect && ab.effect[0] === 'move') {
            if (!ab.displaceFromCenter) {
              applyPlanningDisplace(entid, target, ab, abilityActionId);
            }
            if (ab.AoE) {
              const aoeTargets = getAoE(entid, target, ab.AoE, ab.AoErange);
              if (ab.displaceFromCenter) {
                let centerPos: { x: number; y: number; z: number } | undefined;
                if (target.includes(',')) {
                  const [cx, cy, cz] = target.split(',').map(Number);
                  centerPos = { x: cx, y: cy + 1, z: cz };
                } else {
                  const baseId = target.replace('clone_', '');
                  const centEnt =
                    session.state.players[baseId] ??
                    session.state.enemies[baseId] ??
                    session.state.clones[`clone_${baseId}`] ??
                    session.state.clones[target];
                  if (centEnt) centerPos = { ...(centEnt as any).position };
                }
                if (ab.collisionRejects && aoeTargets.length >= 2) {
                  for (const aoeId of aoeTargets) {
                    vfx(nsp, session, {
                      vfxid: nextVfxId(`plan_col_${aoeId}`),
                      eid: aoeId,
                      type: 'damage',
                      amount: 1,
                    });
                  }
                } else {
                  for (const aoeId of aoeTargets) {
                    if (aoeId !== target) {
                      applyPlanningDisplace(entid, aoeId, ab, abilityActionId, centerPos);
                    }
                  }
                }
              } else {
                for (const aoeId of aoeTargets) {
                  if (aoeId !== target) {
                    applyPlanningDisplace(entid, aoeId, ab, abilityActionId);
                  }
                }
              }
            }
          } else if (ab.effect && ab.effect[0]) {
            applyPlanningStatus(entid, target, ab, abilityActionId);
            let vfxEid: string | null = null;
            if (!target.includes(',')) {
              vfxEid = target;
            } else {
              const [x, y, z] = target.split(',').map(Number);
              const entOnTile = checkEnt(x, y + 1, z);
              if (entOnTile && !entOnTile.isDead) vfxEid = entOnTile.id;
            }
            if (vfxEid) {
              vfx(nsp, session, {
                vfxid: nextVfxId(`plan_${ab.effect[0]}_${vfxEid}`),
                eid: vfxEid,
                type: ab.effect[0],
                amount: null,
              });
            }
          }
        }
        setClear(getClientKey(role, memberKey));
      });
      syncClient(socket, session, role, memberKey);
      gsync(nsp, session);
    });

    socket.on('game:client:toggleEndTurn', async () => {
      if (role === 'spectator')
        return;
      let shouldStartPhase = false;
      await withSessionState(session, () => {
        const client = getPlayerClientState(session, role, memberKey);
        if (!client)
          return;
        if (session.readyPlayers.has(role)) {
          session.readyPlayers.delete(role);
          setClear(getClientKey(role, memberKey));
        }
        else {
          session.readyPlayers.add(role);
          setClear(getClientKey(role, memberKey));
          client.selectedEnt = null;
          client.canSelect = false;
          const activeCount = getActivePlayerRoles(session).length;
          if (activeCount > 0 && session.readyPlayers.size === activeCount) {
            shouldStartPhase = true;
            session.readyPlayers.clear();
          }
        }
      });
      syncClient(socket, session, role, memberKey);
      gsync(nsp, session);
      if (!shouldStartPhase)
        return;
      await withSessionState(session, async () => {
        await nextPhase(
          () => gsync(nsp, session),
          (effect) => vfx(nsp, session, effect),
        );
        for (const key in session.state.clients) {
          setClear(key);
        }
      });
      syncAllClients(nsp, session);
      gsync(nsp, session);
    });

    socket.on('game:client:resetHistory', async () => {
      if (role === 'spectator')
        return;
      await withSessionState(session, () => {
        resetHistory(role);
        setClear(getClientKey(role, memberKey));
        const client = getPlayerClientState(session, role, memberKey);
        if (client) {
          client.selectedEnt = null;
        }
      });
      syncClient(socket, session, role, memberKey);
      gsync(nsp, session);
    });

    socket.on('game:client:sync', () => {
      syncClient(socket, session, role, memberKey);
    });

    socket.on('game:client:globalSync', () => {
      syncFullGlobalState(socket, session);
    });

    socket.on('disconnect', () => {
      const player = session.players.get(memberKey);
      if (!player) {
        return;
      }
      player.status = player.role === 'spectator' ? 'spectator' : 'disconnected';
      if (player.role !== 'spectator') {
        session.readyPlayers.delete(player.role);
      }
      gsync(nsp, session);
    });
  });
}
