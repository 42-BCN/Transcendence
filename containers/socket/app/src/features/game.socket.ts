import type { Namespace, Socket } from 'socket.io';
import TinyQueue from "tinyqueue";
import type { ClientToServerGameEvents, ServerToClientGameEvents } from '../../contracts/sockets/game/game.schema';
import { testMap, parseMap } from './maps';
import type { pos, parse_entity, tile, mapInfo } from './maps';
import { useRef, useEffect, useMemo, useState } from 'react';

const playerIds: string[] = ['assassin', 'paladin', 'mage', 'alchemist'].reverse();
const users: Record<string, string> = {};
let numberOfRolls = 0;

type player = parse_entity & {
  hp: number;
  maxHp: number;
  armor: number;
  status: string | null;
  statusTurns: number;
  facing: string;
  abilities: string[];
  dice: number[];
  usedDice: number[];
  hasMoved: boolean;
};

type enemy = player;

type entity = player | enemy;

type node = {
  id: string,
  pos: pos,
  g: number,
  f: number
}

type mapInfo = {
  width: number;
  height: number;
  depth: number;
}

type ability = {
  name: string;
  target: string;
  dice: number;
  aftermov: boolean;
}

type historyAction = {
  who: string;
  moveto: string | null;
  abilities?: ability[];
}

type abilityInfo = {
  name: string;
  type: string;
  cond: (x: number) => boolean;
  range: number;
  dmg: number | ((x: number) => number);
  cd: number;
  self: boolean;
  AoE?: string;
  AoErange?: number;
  effect?: string[];
}

export type serverGameState = {
  tiles: Record<string, boolean>;
  players: Record<string, entity>;
  enemies: Record<string, entity>;
  clones: Record<string, entity>;
  history: historyAction[];
  clientGameState: Record<string, clientGameState>
}

export type clientGameState = {
  id: string,
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  selectedDice: number | null;
}

export function initState() {
  const playEnt: Record<string, player> = {};
  const enemEnt: Record<string, enemy> = {};
  const worldMap: Record<string, boolean> = {};

  const map = testMap;
  const { tiles, entities, width, height, depth } = parseMap(map)

  tiles.forEach((tile) => {
    worldMap[tile.id] = true;
  });
  entities.forEach((entity) => {
    switch (entity.type) {
      case "assassin":
        playEnt[entity.id] = {
          ...entity, type: "player", hp: 13, maxHp: 13, armor: 0,
          abilities: ["Stab", "Dagger Throw", "Kick", "Restrain"],
          dice: [4, 4, 4, 4, 8],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "paladin":
        playEnt[entity.id] = {
          ...entity, type: "player", hp: 16, maxHp: 16, armor: 0,
          abilities: ["Thrust", "Defend", "Shield Bash", "Vertical Slash"],
          dice: [6, 6, 6, 6],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "mage":
        playEnt[entity.id] = {
          ...entity, type: "player", hp: 8, maxHp: 8, armor: 0,
          abilities: ["Fire Breath", "Azure Comet", "Small Meteor", "Rising Thorns"],
          dice: [4, 8, 12],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "alchemist":
        playEnt[entity.id] = {
          ...entity, type: "player", hp: 10, maxHp: 10, armor: 0,
          abilities: ["Stimulant", "Vacuum Flask", "Bombastic Flask", "Oxidation"],
          dice: [6, 8, 10],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "drone":
        enemEnt[entity.id] = {
          ...entity, type: "drone", hp: 3, maxHp: 3, armor: 0,
          abilities: ["Swoop"],
          dice: [4, 4, 4],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "crawler":
        enemEnt[entity.id] = {
          ...entity, type: "drone", hp: 4, maxHp: 4, armor: 0,
          abilities: ["Claw"],
          dice: [4, 4, 6],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "spawner":
        enemEnt[entity.id] = {
          ...entity, type: "enemy", hp: 10, maxHp: 10, armor: 0,
          abilities: ["Spawn Drone", "Spawn Crawler"],
          dice: [4, 6],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "mortar":
        enemEnt[entity.id] = {
          ...entity, type: "enemy", hp: 12, maxHp: 12, armor: 0,
          abilities: ["Shoot", "Reload"],
          dice: [6, 6],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "centurion":
        enemEnt[entity.id] = {
          ...entity, type: "enemy", hp: 20, maxHp: 20, armor: 2,
          abilities: ["Charge", "Atomic Bomb"],
          dice: [6, 8, 8],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
      case "jaeger":
        enemEnt[entity.id] = {
          ...entity, type: "enemy", hp: 10, maxHp: 10, armor: 1,
          abilities: ["Push", "Railgun"],
          dice: [6, 6, 10],
          usedDice: [],
          facing: "center",
          status: null,
          statusTurns: 0,
          hasMoved: false,
        }
        break;
    }
  });
  return {
    players: playEnt,
    enemies: enemEnt,
    tiles: worldMap,
    mapBounds: { width, height, depth }
  }
}

export type ServerGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END';
  turn: number;
  players: Record<string, player>;
  clones: Record<string, player>;
  enemies: Record<string, enemy>;
  tiles: Record<string, boolean>;
  history: historyAction[];
  mapBounds: mapInfo;
}

const gameState: ServerGameState = {
  phase: 'PLAN',
  turn: 1,
  players: {},
  clones: {},
  enemies: {},
  tiles: {},
  history: [],
  mapBounds: { width: 0, height: 0, depth: 0 },
};

// global function execution means it doesn't reset when disconnected

const initstate = initState();
gameState.players = initstate.players;
gameState.enemies = initstate.enemies;
gameState.tiles = initstate.tiles;
gameState.mapBounds = initstate.mapBounds;

export function registerGameSocket(nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>) {
  nsp.on('connection', (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
    socket.emit('game:server:init', gameState);
    // socket.emit('game:server:sync', gameState);
    const assignedRole = playerIds.pop();
    if (!assignedRole)
      return (console.log('Room full, spectator joined:', socket.id));
    users[socket.id] = assignedRole;
    console.log('Emitted join server event with role:', assignedRole);
    socket.emit('game:server:join', assignedRole);
    // socket.on('game::client::join', (assignedRole: string) => {
    //   console.log('Received join even with role:', assignedRole);
    //   socket.emit('game::server::join', assignedRole);
    // });
    socket.on('game:client:displayMoveRange', (payload: number) => {
      console.log('Received move range event with dice:', payload,
        'for character', users[socket.id]);
      nsp.emit('game:server:rolls', payload);
      // highlights = ()
      // socket.emit('game:server:displayMoveRange', (payload: number) => {
      // console.log('game:server:displayMoveRange called'));
    });
    socket.on('game:client:rolls', (payload: number) => {
      console.log('Received roll dice event with quantity:', payload);
      numberOfRolls += payload;
      nsp.emit('game:server:rolls', numberOfRolls);
    });
    socket.on('disconnect', () => {
      const free = users[socket.id];
      if (free) {
        playerIds.push(free);
        delete users[socket.id];
        console.log(free, 'disconnected, role', playerIds[playerIds.length - 1], 'is available again.');
      }
    });
  });
  }
