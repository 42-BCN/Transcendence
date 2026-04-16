import { create } from "zustand";
import TinyQueue from "tinyqueue";
import type { parse_entity, pos, tile } from "./maps";
import { gameSocket } from '@/lib/sockets/socket';

export type globalGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END';
  turn: number;
  players: Record<string, player>;
  clones: Record<string, player>;
  enemies: Record<string, enemy>;
  tiles: Record<string, boolean>;
  history: historyAction[];
  mapBounds: mapInfo;
}

export type localGameState = {
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  selectedDice: number | null;
}

type gamePhase = "PLAN" | "EXEC" | "ENEMY" | "END"

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

type gameState = {
  turn: number;
  phase: gamePhase;

  rollQuantity: number;
  assignedCharacter: string;

  //global state
  players: Record<string, entity>;
  enemies: Record<string, entity>;
  clones: Record<string, entity>;
  tiles: Record<string, boolean>;
  history: historyAction[];
  mapBounds: mapInfo;

  //local state
  typeEnt: string | null;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  affected: Record<string, boolean>;
  selectedDice: number | null;

  nextPhase: () => Promise<void>;
  executionPhase: () => Promise<void>;
  enemyPhase: () => Promise<void>;
  endTurn: () => void;

  setRollQuantity: (quantity: number) => void;
  rollDice: (quantity: number) => void;
  initSocketListeners: () => void;
  cleanupSocketListeners: () => void;

  selectEntity: (Id: string) => void;
  getSel: () => entity | undefined;
  movDice: (mov: number) => void;
  selectDice: (dice: number) => void;
  addHistory: (who: string, type: string, target: string, dice?: number, ability?: string) => void;
  resetHistory: (id: string) => void;
  addHistoryAbility: (target: string) => void;
  moveTo: (entId: string, tileId: string) => Promise<void>;
  moveClone: (tileId: string) => void;
  init: (entities: parse_entity[], tiles: tile[], mapInfo: mapInfo) => void;
  checkEnt: (x: number, y: number, z: number) => entity | undefined;
  isOOB: (x: number, y: number, z: number) => boolean;
  isBlocked: (x: number, y: number, z: number) => boolean;
  hasFloor: (x: number, y: number, z: number) => boolean;
  dijkstra: (pos: pos, maxCost: number) => string[];
  Astar: (src: pos, dest: pos) => string[] | undefined;
  isValid: (x: number, y: number, z: number) => boolean;
  euclidTiles: (pos: pos, range: number, is3D: boolean) => Record<string, boolean>;
  hasLoS: (pos: pos, x: number, y: number, z: number) => number;
  crossTiles: (pos: pos, range: number) => Record<string, boolean>;
  paint: (pos: pos, type: string, range: number, self: boolean) => Record<string, boolean>;
  selectAbility: (name: string) => void;
  showAbRange: (name: string) => void;
  getAbility: (name: string) => abilityInfo;
  executeAbility: (who: string, which: string, target: string) => void;
  clearHighlights: () => void;
  clearSelectables: () => void;
  takeAb: (id: string, type: string, ab: abilityInfo, roll: number) => player | enemy;
}

const clean = {
  canSelect: true,
  typeEnt: null,
  selectedAb: null,
  selectedDice: null,
  selectedEnt: null,
  highlights: {},
  selectables: {},
  affected: {},
} as const;

export const useGame = create<gameState>()((set, get) => ({
  turn: 1,
  phase: "PLAN",

  rollQuantity: 0,
  assignedCharacter: 'spectator',

  canSelect: true,
  typeEnt: null,
  selectedAb: null,
  selectedEnt: null,
  chosenPlayer: null,
  selectedDice: null,

  players: {},
  enemies: {},
  clones: {},
  tiles: {},
  highlights: {},
  selectables: {},
  affected: {},
  history: [],
  mapBounds: { width: 0, height: 0, depth: 0 },

  nextPhase: async () => {
    const state = get();
    if (state.phase !== "PLAN")
      return;
    set({ ...clean, phase: "EXEC", canSelect: false });
    try {
      await get().executionPhase();
      set({ ...clean, phase: "ENEMY", canSelect: false });
      await get().enemyPhase();
      set({ phase: "END" });
      get().endTurn();
    }
    catch (err) {
      console.error("Turn resolution failed:", err);
      set({ ...clean, phase: "PLAN", canSelect: true });
    }
  },

  executionPhase: async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const history = get().history;

    for (const action of history) {
      for (const ab of action.abilities ?? []) {
        if (!ab.aftermov) {
          get().executeAbility(action.who, ab.name, ab.target);
          await sleep(400);
        }
      }
      if (action.moveto) {
        const cloneKey = `clone_${action.who}`;
        const { [cloneKey]: _, ...remainingClones } = get().clones;
        set({ clones: remainingClones });
        await get().moveTo(action.who, action.moveto);
      }
      for (const ab of action.abilities ?? []) {
        if (ab.aftermov) {
          get().executeAbility(action.who, ab.name, ab.target);
          await sleep(400);
        }
      }
    }
  },

  enemyPhase: async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    console.log("Enemy turn");
    await sleep(1000);
  },

  endTurn: () => {
    const state = get();
    const updatedPlayers = { ...state.players };
    Object.keys(updatedPlayers).forEach((id) => {
      updatedPlayers[id] = {
        ...updatedPlayers[id],
        dice: [...updatedPlayers[id].dice, ...updatedPlayers[id].usedDice].sort((a, b) => a - b),
        usedDice: [],
        hasMoved: false,
      };
    });
    const updatedEnemies = { ...state.enemies };
    Object.keys(updatedEnemies).forEach((id) => {
      updatedEnemies[id] = {
        ...updatedEnemies[id],
        dice: [...updatedEnemies[id].dice, ...updatedEnemies[id].usedDice].sort((a, b) => a - b),
        usedDice: [],
        hasMoved: false,
      };
    });
    set({
      ...clean,
      turn: state.turn + 1,
      phase: "PLAN",
      history: [],
      clones: {},
      players: updatedPlayers,
      enemies: updatedEnemies,
      canSelect: true,
    });
    console.log("New turn");
  },


  selectEntity: (id) => {
    const state = get();
    gameSocket.emit('game:client:selectEntity', id);
    let ent = state.players[id] || state.enemies[id] || state.clones[id];
    console.log("ent.id: ", ent.id);
  },

  getSel: () => {
    const s = get();
    if (!s.selectedEnt)
      return;
    const id = s.selectedEnt;
    return (s.players[id] || s.enemies[id] || s.clones[id]);
  },

  movDice: (mov) => {
    if (!get().getSel())
      throw new Error("no ent id!");
    gameSocket.emit('game:client:displayMoveRange', mov);
  },

  selectDice: (dice) => {
    gameSocket.emit('game:client:selectDice', dice);
  },

  resetHistory: (id) => {
    const state = get();
    const newHistory = state.history.filter((action) => action.who !== id);
    const { [`clone_${id}`]: _, ...remainingClones } = state.clones;
    return set({
      history: [...newHistory],
      players: {
        ...state.players,
        [id]: {
          ...state.players[id],
          dice: [...state.players[id].dice, ...state.players[id].usedDice].sort((a, b) => a - b),
          usedDice: [],
          hasMoved: false,
        },
      },
      clones: { ...remainingClones },
    });
  },

  addHistory: (id, type, target, dice = 0, ability = "") => set((state) => {
    const len = state.history.length;
    const who = id.startsWith("clone_") ? id.replace("clone_", "") : id;
    const exists = state.history.some((h) => h.who === who);
    //    const ent = state.players[id] || state.enemies[id] || state.clones[id];

    if (!exists && len >= 4)
      throw new Error("History over 4 elements!");
    console.log("history: ", state.history);
    let lastAction = null;
    const newHistory = [...state.history];
    //getprev
    for (let i = 0; i < len; ++i) {
      if (who !== newHistory[i].who)
        continue;
      [lastAction] = newHistory.splice(i, 1);
      break;
    }
    if (!lastAction) {
      newHistory.push({
        who: who,
        moveto: type === "mov" ? target : null,
        abilities: type === "ability" ? [{ name: ability, target: target, dice: dice, aftermov: false }] : [],
      });
      console.log("newHistory: ", newHistory);
      return { history: newHistory };
    }
    const newAction = { ...lastAction };
    if (type === "ability") {
      const aftermov = Boolean(lastAction.moveto) && id !== who;
      newAction.abilities = [...(lastAction.abilities || []), {
        name: ability,
        target: target,
        dice: dice,
        aftermov: aftermov
      }];
      if (lastAction.moveto && !aftermov) {
        const { [`clone_${who}`]: _, ...remainingClones } = state.clones;
        newAction.moveto = null;
        newHistory.push(newAction);
        console.log("newHistory from inside the clone deletion: ", newHistory);
        return { clones: { ...remainingClones }, history: newHistory };
      }
    }
    else if (type === "mov") {
      newAction.moveto = target;
      newAction.abilities = lastAction.abilities?.filter((ab) => ab.aftermov === false) || [];
    }
    newHistory.push(newAction);
    console.log("newHistory: ", newHistory);
    return { history: newHistory };
  }),

  addHistoryAbility: (target) => {
    const state = get();
    const entid = state.selectedEnt;
    const selectedDice = state.selectedDice;
    const selectedAb = state.selectedAb;

    if (!entid || !selectedDice || !selectedAb)
      throw new Error("Couldn't add ability to history!");
    state.addHistory(entid, "ability", target, selectedDice, selectedAb);
    if (state.players[entid]) {
      return set({
        ...clean,
        players: {
          ...state.players,
          [entid]: {
            ...state.players[entid],
            dice: state.players[entid].dice.toSpliced(
              state.players[entid].dice.indexOf(selectedDice), 1),
            usedDice: [...state.players[entid].usedDice, selectedDice].sort((a, b) => a - b),
          },
        },
      });
    }
    if (state.clones[entid]) {
      return set({
        ...clean,
        clones: {
          ...state.clones,
          [entid]: {
            ...state.clones[entid],
            dice: state.clones[entid].dice.toSpliced(
              state.clones[entid].dice.indexOf(selectedDice), 1),
            usedDice: [...state.clones[entid].usedDice, selectedDice].sort((a, b) => a - b),
          },
        },
      });
    }
  },
  //
  moveClone: (tileId) => {
    const state = get()
    if (!state.highlights[tileId] || !state.selectedEnt || !state.selectedDice)
      return;
    const [x, y, z] = tileId.split(',').map(Number);
    const dest = { x, y: (y + 1), z };
    const ent = state.players[state.selectedEnt];
    if (!ent)
      throw new Error("no ent id!");
    state.addHistory(state.selectedEnt, "mov", tileId);
    const cloneid = `clone_${ent.id}`;
    set({
      ...clean,
      typeEnt: "clone",
      clones: {
        ...state.clones,
        [cloneid]: {
          ...state.players[ent.id],
          type: "clone",
          id: cloneid,
          dice: state.players[ent.id].dice.toSpliced(
            state.players[ent.id].dice.indexOf(state.selectedDice), 1),
          usedDice: [...state.players[ent.id].usedDice, state.selectedDice].sort((a, b) => a - b),
          hasMoved: true,
          position: dest,
        }
      }
    });
  },

  // moveTo: async (entId, tileId) => {
  //   const state = get()
  //   const [x, y, z] = tileId.split(',').map(Number);
  //   const dest = { x, y: (y + 1), z };
  //   let ent = state.players[entId] || state.clones[entId] || state.enemies[entId];
  //   if (!ent)
  //     throw new Error(`Entity not found when trying to move: ${entId}`);
  //   const path = state.Astar(ent.position, dest);
  //   if (!path || path.length === 0)
  //     return;
  //   const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  //   for (let i = 1; i < path.length; ++i) {
  //     await sleep(300);
  //     const [sx, sy, sz] = path[i].split(',').map(Number);
  //     const stepPos = { x: sx, y: sy, z: sz };
  //     set((currState) => {
  //       if (ent.type === "player") {
  //         return {
  //           players: {
  //             ...currState.players,
  //             [entId]: {
  //               ...currState.players[entId],
  //               position: stepPos
  //             }
  //           }
  //         }
  //       }
  //       return {
  //         enemies: {
  //           ...currState.enemies,
  //           [entId]: {
  //             ...currState.enemies[entId],
  //             position: stepPos
  //           }
  //         }
  //       };
  //     });
  //   }
  // },
  //

  // init: (entities, tiles, mapInfo) => {
  //   const playEnt: Record<string, player> = {};
  //   const enemEnt: Record<string, enemy> = {};
  //   const worldMap: Record<string, boolean> = {};
  //
  //   tiles.forEach((tile) => {
  //     worldMap[tile.id] = true;
  //   });
  //   entities.forEach((entity) => {
  //     switch (entity.type) {
  //       case "assassin":
  //         playEnt[entity.id] = {
  //           ...entity, type: "player", hp: 13, maxHp: 13, armor: 0,
  //           abilities: ["Stab", "Dagger Throw", "Kick", "Restrain"],
  //           dice: [4, 4, 4, 4, 8],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "paladin":
  //         playEnt[entity.id] = {
  //           ...entity, type: "player", hp: 16, maxHp: 16, armor: 0,
  //           abilities: ["Thrust", "Defend", "Shield Bash", "Vertical Slash"],
  //           dice: [6, 6, 6, 6],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "mage":
  //         playEnt[entity.id] = {
  //           ...entity, type: "player", hp: 8, maxHp: 8, armor: 0,
  //           abilities: ["Fire Breath", "Azure Comet", "Small Meteor", "Rising Thorns"],
  //           dice: [4, 8, 12],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "alchemist":
  //         playEnt[entity.id] = {
  //           ...entity, type: "player", hp: 10, maxHp: 10, armor: 0,
  //           abilities: ["Stimulant", "Vacuum Flask", "Bombastic Flask", "Oxidation"],
  //           dice: [6, 8, 10],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "drone":
  //         enemEnt[entity.id] = {
  //           ...entity, type: "drone", hp: 3, maxHp: 3, armor: 0,
  //           abilities: ["Swoop"],
  //           dice: [4, 4, 4],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "crawler":
  //         enemEnt[entity.id] = {
  //           ...entity, type: "drone", hp: 4, maxHp: 4, armor: 0,
  //           abilities: ["Claw"],
  //           dice: [4, 4, 6],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "spawner":
  //         enemEnt[entity.id] = {
  //           ...entity, type: "enemy", hp: 10, maxHp: 10, armor: 0,
  //           abilities: ["Spawn Drone", "Spawn Crawler"],
  //           dice: [4, 6],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "mortar":
  //         enemEnt[entity.id] = {
  //           ...entity, type: "enemy", hp: 12, maxHp: 12, armor: 0,
  //           abilities: ["Shoot", "Reload"],
  //           dice: [6, 6],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "centurion":
  //         enemEnt[entity.id] = {
  //           ...entity, type: "enemy", hp: 20, maxHp: 20, armor: 2,
  //           abilities: ["Charge", "Atomic Bomb"],
  //           dice: [6, 8, 8],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //       case "jaeger":
  //         enemEnt[entity.id] = {
  //           ...entity, type: "enemy", hp: 10, maxHp: 10, armor: 1,
  //           abilities: ["Push", "Railgun"],
  //           dice: [6, 6, 10],
  //           usedDice: [],
  //           facing: "center",
  //           status: null,
  //           statusTurns: 0,
  //           hasMoved: false,
  //         }
  //         break;
  //     }
  //   });
  //   set({
  //     players: playEnt,
  //     enemies: enemEnt,
  //     tiles: worldMap,
  //     mapBounds: mapInfo,
  //   });
  // },

  // checkEnt: (x, y, z) => {
  //   const state = get();
  //   const entities = [
  //     ...Object.values(state.players),
  //     ...Object.values(state.enemies),
  //     ...Object.values(state.clones),
  //   ];
  //
  //   return entities.find((e) =>
  //     e.position.x === x
  //     && e.position.y === y
  //     && e.position.z === z);
  // },

  // isOOB: (x, y, z) => {
  //   const state = get();
  //   if (x < 0 || y < 0 || z < 0 || x >= state.mapBounds.width
  //     || y >= state.mapBounds.height + 1 || z >= state.mapBounds.depth)
  //     return true;
  //   return false;
  // },

  // isBlocked: (x, y, z) => {
  //   const state = get();
  //   const key = `${x},${y},${z}`;
  //   return (state.tiles[key] || state.checkEnt(x, y, z) ? true : false);
  // },
  //
  // hasFloor: (x, y, z) => {
  //   const state = get();
  //   return (y - 1 < 0 || (state.isBlocked(x, y - 1, z)
  //     && !state.checkEnt(x, y - 1, z)) ? true : false)
  // },

  // dijkstra: (pos, maxCost) => {
  //   const state = get();
  //   const initial = `${pos.x},${pos.y},${pos.z}`;
  //   const MOV = [
  //     [1, 0, 0], [-1, 0, 0],
  //     [0, 0, 1], [0, 0, -1],
  //     [1, 1, 0], [-1, 1, 0],
  //     [0, 1, 1], [0, 1, -1],
  //     [1, -1, 0], [-1, -1, 0],
  //     [0, -1, 1], [0, -1, -1],
  //   ];
  //   const dist: Record<string, number> = { [initial]: 0 };
  //   const nodes = new TinyQueue<{ key: string; d: number }>([], (a, b) => a.d - b.d);
  //   nodes.push({ key: initial, d: 0 });
  //   while (nodes.length > 0) {
  //     const { key, d } = nodes.pop()!;
  //     if (d > (dist[key] ?? Infinity))
  //       continue;
  //     if (d > maxCost)
  //       break;
  //     const [x, y, z] = key.split(",").map(Number);
  //     for (const [dx, dy, dz] of MOV) {
  //       const nx = x + dx;
  //       const ny = y + dy;
  //       const nz = z + dz;
  //       if (state.isOOB(nx, ny, nz) || state.isBlocked(nx, ny, nz)
  //         || !state.hasFloor(nx, ny, nz))
  //         continue;
  //       const stepCost = dy === 1 ? 2 : 1;
  //       const newCost = d + stepCost;
  //       const nkey = `${nx},${ny},${nz}`;
  //       if (newCost < (dist[nkey] ?? Infinity)) {
  //         dist[nkey] = newCost;
  //         nodes.push({ key: nkey, d: newCost });
  //       }
  //     }
  //   }
  //   const reachable: string[] = [];
  //   for (const key in dist) {
  //     if (dist[key] <= maxCost && key !== initial) {
  //       const [x, y, z] = key.split(",").map(Number);
  //       reachable.push(`${x},${y - 1},${z}`);
  //     }
  //   }
  //
  //   return reachable;
  // },
  //
  Astar: (src, dest) => {
    const state = get();
    const MOV = [
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1],
      [1, 1, 0], [-1, 1, 0],
      [0, 1, 1], [0, 1, -1],
      [1, -1, 0], [-1, -1, 0],
      [0, -1, 1], [0, -1, -1]
    ];
    const bestG: Record<string, number> = {};
    const History: Record<string, string | null> = {};
    const Closed = new Set();
    const Open = new TinyQueue([], (a: node, b: node) => a.f - b.f);
    const destKey = `${dest.x},${dest.y},${dest.z}`
    const heuristic = (p1: pos, p2: pos) => Math.abs(p1.x - p2.x) + ((p2.y - p1.y)
      + Math.abs(p2.y - p1.y)) / 2 + Math.abs(p1.z - p2.z);
    const initial: node = {
      id: `${src.x},${src.y},${src.z}`,
      pos: { x: src.x, y: src.y, z: src.z },
      g: 0,
      f: heuristic(src, dest)
    };
    Open.push(initial);
    bestG[initial.id] = 0;
    History[initial.id] = null;
    while (Open.length > 0) {
      const node = Open.pop()
      if (!node || !node.pos)
        return;
      if (bestG[node.id] !== node.g)
        continue;
      if (node.id === destKey) {
        const path = [];
        let key: string | null = destKey;
        while (key !== null) {
          path.push(key)
          key = History[key]
        }
        return path.reverse();
      }
      Closed.add(node?.id)
      for (const [dx, dy, dz] of MOV) {
        const nx = node?.pos?.x + dx;
        const ny = node?.pos?.y + dy;
        const nz = node?.pos?.z + dz;

        if (state.isOOB(nx, ny, nz) || state.isBlocked(nx, ny, nz) || !state.hasFloor(nx, ny, nz))
          continue;
        const newG = node.g +
          (dy === 1 ? 2 : 1)
        const Id = `${nx},${ny},${nz}`;
        if (Closed.has(Id))
          continue;
        if (bestG[Id] === undefined || newG < bestG[Id]) {
          bestG[Id] = newG;
          const newNode = {
            id: Id,
            pos: { x: nx, y: ny, z: nz },
            g: newG,
            f: newG + heuristic(
              { x: nx, y: ny, z: nz }, dest)
          };
          Open.push(newNode)
          History[newNode.id] = node.id;
        }
      }
    }
    return [];
  },

  // hasLoS: (pos, x, y, z) => {
  //   const dx = x - pos.x;
  //   const dy = y - pos.y;
  //   const dz = z - pos.z;
  //   const state = get();
  //   const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
  //   if (steps < 1)
  //     return 1;
  //   let cx = pos.x;
  //   let cy = pos.y;
  //   let cz = pos.z;
  //   for (let i = 1; i < steps; i++) {
  //     cx += dx / steps;
  //     cy += dy / steps;
  //     cz += dz / steps;
  //     const rx = Math.round(cx);
  //     const ry = Math.round(cy);
  //     const rz = Math.round(cz);
  //     if (state.isBlocked(rx, ry, rz))
  //       return -1;
  //   }
  //   if (state.checkEnt(x, y, z))
  //     return 0;
  //   if (state.isBlocked(x, y, z))
  //     return -1;
  //   return 1;
  // },
  // //
  // // euclidTiles: (pos, range, is3D) => {
  // //   const state = get();
  // //   const hmax = is3D ? range : 0;
  // //   const hmin = is3D ? -range : 0;
  // //   const valid: Record<string, boolean> = {};
  // //   for (let dx = -range; dx <= range; ++dx) {
  // //     for (let dy = hmin; dy <= hmax; ++dy) {
  // //       for (let dz = -range; dz <= range; ++dz) {
  // //         const x = pos.x + dx;
  // //         const y = pos.y + dy;
  // //         const z = pos.z + dz;
  // //         if (!state.isValid(x, y, z) || state.tiles[`${x},${y},${z}`]
  // //           || (range * range < dx * dx + dy * dy + dz * dz))
  // //           continue;
  // //         const resLoS = state.hasLoS(pos, x, y, z);
  // //         if (resLoS === -1)
  // //           continue;
  // //         if (resLoS === 0) {
  // //           const entid = state.checkEnt(x, y, z)?.id;
  // //           if (entid)
  // //             valid[entid] = true;
  // //           continue;
  // //         }
  // //         valid[`${x},${y - 1},${z}`] = true;
  // //       }
  // //     }
  // //   }
  // //   return (valid);
  // // },
  // //
  // // isValid: (x, y, z) => {
  // //   const state = get()
  // //   return (x >= state.mapBounds.width || y >= state.mapBounds.height + 1
  // //     || z >= state.mapBounds.depth || x < 0 || y < 0 || z < 0 ? false : true)
  // // },
  // //
  // // crossTiles: (pos, range) => {
  // //   const state = get();
  // //   const CROSS = [
  // //     [1, 0, 0], [-1, 0, 0],
  // //     [0, 0, 1], [0, 0, -1]
  // //   ];
  // //   const valid: Record<string, boolean> = {};
  // //   for (const [dx, dy, dz] of CROSS) {
  // //     for (let n = 1; n <= range; ++n) {
  // //       const x = pos.x + n * dx;
  // //       const y = pos.y + n * dy;
  // //       const z = pos.z + n * dz;
  // //       if (!state.isValid(x, y, z) || state.tiles[`${x},${y},${z}`])
  // //         break;
  // //       const ent = state.checkEnt(x, y, z);
  // //       if (ent) {
  // //         valid[ent.id] = true;
  // //         break;
  // //       }
  // //       valid[`${x},${y - 1},${z}`] = true;
  // //     }
  // //   }
  // //   return (valid);
  // // },
  // //
  // // paint: (pos, type, range, self) => {
  // //   const state = get()
  // //   if (!state.selectedEnt)
  // //     return {};
  // //   let valid: Record<string, boolean>;
  // //   switch (type) {
  // //     case 'cross':
  // //       valid = state.crossTiles(pos, range);
  // //       break;
  // //     case 'circle':
  // //       valid = state.euclidTiles(pos, range, false);
  // //       break;
  // //     case 'sphere':
  // //       valid = state.euclidTiles(pos, range, true);
  // //       break;
  // //     default:
  // //       valid = {};
  // //   }
  // //   valid[state.selectedEnt] = false;
  // //   if (self)
  // //     valid[state.selectedEnt] = true;
  // //   return (valid);
  // // },
  // //
  // // getAbility: (name): abilityInfo => {
  // //   switch (name) {
  // //     case "Stab":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         cond: (x: number) => (x % 2) !== 0,
  // //         range: 1,
  // //         dmg: 1,
  // //         cd: 0,
  // //         self: false,
  // //         effect: ["bleed", "1"],
  // //       }
  // //     case "Dagger Throw":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         effect: ["bleed", "1"],
  // //         cond: (x: number) => x > 3,
  // //         range: 3,
  // //         dmg: 1,
  // //         cd: 0,
  // //         self: false,
  // //       }
  // //     case "Kick":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         effect: ["move", "away"],
  // //         cond: (x: number) => x > 2,
  // //         range: 1,
  // //         dmg: 1,
  // //         cd: 0,
  // //         self: false,
  // //       }
  // //     case "Restrain":
  // //       return {
  // //         name: name,
  // //         type: "circle",
  // //         effect: ["restrain", "2"],
  // //         cond: (x: number) => x > 2,
  // //         range: 3,
  // //         dmg: 1,
  // //         cd: 0,
  // //         self: false,
  // //       }
  // //     case "Thrust":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         cond: (x: number) => x > 3,
  // //         range: 2,
  // //         dmg: 2,
  // //         cd: 1,
  // //         self: false,
  // //       }
  // //     case "Defend":
  // //       return {
  // //         name: name,
  // //         type: "circle",
  // //         effect: ["defend", "2"],
  // //         cond: (x: number) => x > 2,
  // //         range: 2,
  // //         dmg: 0,
  // //         cd: 0,
  // //         self: false,
  // //       }
  // //     case "Shield Bash":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         effect: ["move", "away"],
  // //         cond: (x: number) => x > 5,
  // //         range: 0,
  // //         dmg: 4,
  // //         cd: 2,
  // //         AoE: "circle",
  // //         AoErange: 2,
  // //         self: true,
  // //       }
  // //     case "Vertical Slash":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         cond: (x: number) => x > 3,
  // //         range: 1,
  // //         dmg: (bonus: number) => 1 + bonus,
  // //         cd: 1,
  // //         AoE: "vertical",
  // //         AoErange: 1,
  // //         self: false,
  // //       }
  // //     case "Fire Breath":
  // //       return {
  // //         name: name,
  // //         type: "cone",
  // //         effect: ["burn", "2"],
  // //         cond: (x: number) => x > 3,
  // //         range: 3,
  // //         dmg: (res: number) => Math.floor(res / 3),
  // //         cd: 2,
  // //         self: false,
  // //       }
  // //     case "Azure Comet":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         cond: (x: number) => x > 3,
  // //         range: 5,
  // //         dmg: (res: number) => Math.floor(res / 2) + 2,
  // //         cd: 3,
  // //         self: false,
  // //       }
  // //     case "Small Meteor":
  // //       return {
  // //         name: name,
  // //         type: "smcircle",
  // //         cond: (x: number) => x > 2,
  // //         range: 4,
  // //         dmg: (bonus: number) => 1 + bonus,
  // //         cd: 1,
  // //         self: false,
  // //       }
  // //     case "Rising Thorns":
  // //       return {
  // //         name: name,
  // //         type: "rtcircle",
  // //         cond: (x: number) => x > 2,
  // //         range: 4,
  // //         dmg: (bonus: number) => 1 + bonus,
  // //         cd: 1,
  // //         self: false,
  // //       }
  // //     case "Stimulant":
  // //       return {
  // //         name: name,
  // //         type: "cross",
  // //         effect: ["bonus dice", "1"],
  // //         cond: (x: number) => x > 2,
  // //         range: 2,
  // //         dmg: 0,
  // //         cd: 0,
  // //         self: true,
  // //       }
  // //     case "Vacuum Flask":
  // //       return {
  // //         name: name,
  // //         type: "circle",
  // //         effect: ["move", "towards"],
  // //         cond: (x: number) => x > 2,
  // //         range: 3,
  // //         dmg: 1,
  // //         cd: 0,
  // //         self: false,
  // //       }
  // //     case "Bombastic Flask":
  // //       return {
  // //         name: name,
  // //         type: "circle",
  // //         effect: ["move", "away"],
  // //         cond: (x: number) => x > 2,
  // //         range: 2,
  // //         dmg: (res: number) => Math.floor(res / 2) - 2,
  // //         cd: 0,
  // //         self: false,
  // //       }
  // //     case "Oxidation":
  // //       return {
  // //         name: name,
  // //         type: "circle",
  // //         effect: ["oxidation", "2"],
  // //         cond: (x: number) => x > 2,
  // //         range: 2,
  // //         dmg: 0,
  // //         cd: 0,
  // //         self: false,
  // //       }
  // //     default:
  // //       return {
  // //         name: "error",
  // //         type: "sphere",
  // //         cond: (x: number) => x > 2,
  // //         range: 3,
  // //         dmg: 1,
  // //         cd: 0,
  // //         self: true,
  // //       }
  // //   }
  // // },
  // //
  selectAbility: (name) => {
    const state = get()
    const ent = state.getSel();
    if (!ent)
      throw new Error("no ent id!");
    // const { type, range, self } = state.getAbility(name);
    // if (state.selectedAb === name)
    //   return set({
    //     selectedAb: null,
    //     selectedDice: null,
    //     highlights: {},
    //     selectables: {},
    //     canSelect: true,
    //   });
    gameSocket.emit('game:client:displayAbilityRange', name)
    // set({
    //   selectedAb: name,
    //   highlights: {},
    //   selectedDice: null,
    //   selectables: state.paint(ent.position, type, range, self),
    //   canSelect: false,
    // });
    // console.log("SelectedAb: ", get().selectedAb);
    // console.log("Selectables: ", get().selectables);
  },
  //
  showAbRange: (name) => {
    const state = get()
    const ent = state.getSel();
    if (!ent)
      throw new Error("no ent id!");
    // const { type, range, self } = state.getAbility(name);
    // set({ highlights: {}, selectedDice: null, });
    gameSocket.emit('game:client:displayAbilityRange', name);
    // selectables: state.paint(ent.position, type, range, self),
  },

  takeAb: (id, type, ab, roll) => {
    const state = get();
    const target = type === "enemy" ? { ...state.enemies[id] } : { ...state.players[id] };

    target.hp = target.hp - (typeof ab.dmg === 'function' ? ab.dmg(roll) : ab.dmg);;
    if (target.hp < 0)
      target.hp = 0;
    const hadStatus = Boolean(target.status);
    if (!target.status && ab.effect) {
      target.status = ab.effect[0];
      if (target.status !== "push" && !hadStatus)
        target.statusTurns = Number(ab.effect[1]);
    }
    return (target);
  },

  executeAbility: (who, which, target) => {
    const state = get();
    if (!which || !who)
      return;
    const ent = state.players[who] || state.enemies[who] || state.clones[who];
    const ab = state.getAbility(which);
    if (!ent)
      throw new Error("No entity found!");
    const ability = state.history.find((h) => h.who === who)?.abilities?.find(
      (a) => a.name === which && a.target === target);
    const dvalue = ability?.dice;
    if (!dvalue)
      throw new Error("No dice value found when executing ability!");
    const roll = Math.ceil(Math.random() * dvalue);
    if (!ab.cond(roll))
      return;
    const targets = [target];
    // if (ab.AoE)
    //   targets.push(...state.getAoE(pos, ab.AoEtype, AoErange));
    const changedPlayers: player[] = [];
    const changedEnemies: enemy[] = [];
    targets.forEach((id) => {
      if (state.enemies[id])
        changedEnemies.push(state.takeAb(id, "enemy", ab, roll))
      else if (state.players[id])
        changedPlayers.push(state.takeAb(id, "player", ab, roll))
    })
    set({
      players: { ...state.players, ...Object.fromEntries(changedPlayers.map(p => [p.id, p])) },
      enemies: { ...state.enemies, ...Object.fromEntries(changedEnemies.map(e => [e.id, e])) },
    })
  },

  clearHighlights: () => {
    gameSocket.emit('game:client:clearHl');
    set({ highlights: {} });
  },

  clearSelectables: () => {
    gameSocket.emit('game:client:clearSl');
    set({ selectables: {} });
  },

  initSocketListeners: () => {
    const handleJoin = (id: string) => {
      console.log(id, 'joined');
      set({ assignedCharacter: id });
    };
    // const handleInit = (initState: GlobalGameState) => {
    //   console.log('recieved init event with character', get().assignedCharacter);
    //   set({
    //     phase: 'PLAN',
    //     turn: 1,
    //     tiles: initState.tiles,
    //     enemies: initState.enemies,
    //     players: initState.players,
    //     clones: initState.clones,
    //     history: initState.history,
    //     mapBounds: initState.mapBounds,
    //   });
    // };
    const handleGlobalSync = (state: globalGameState) => {
      console.log('recieved sync event with character', get().assignedCharacter);
      set({
        phase: state.phase,
        turn: state.turn,
        tiles: state.tiles,
        enemies: state.enemies,
        players: state.players,
        clones: state.clones,
        history: state.history,
        mapBounds: state.mapBounds,
      });
    };

    const handleSync = (state: localGameState) => {
      console.log('recieved sync event with character', get().assignedCharacter);
      set({
        highlights: state.highlights,
        selectables: state.selectables,
        canSelect: state.canSelect,
        selectedAb: state.selectedAb,
        selectedEnt: state.selectedEnt,
        selectedDice: state.selectedDice,
      });
    };

    const handleUpdateRolls = (quantity: number) => {
      console.log('Received game rolls update event', quantity);
      set({ rollQuantity: quantity });
    };
    const handleHighlights = (highlights: Record<string, boolean>) => {
      console.log('Received highlights form server');
      set({ highlights: highlights });
    };

    const handleSelectables = (selectables: Record<string, boolean>) => {
      console.log('Received highlights form server');
      set({ selectables: selectables });
    };

    gameSocket.on('connect', () => console.log('Connected to game events socket server'));
    gameSocket.on('disconnect', () => console.log('Disconnected from game events socket server'));
    gameSocket.on('game:server:join', handleJoin);
    // gameSocket.on('game:server:init', handleInit);
    gameSocket.on('game:server:globalSync', handleGlobalSync);
    gameSocket.on('game:server:sync', handleSync);
    gameSocket.on('game:server:displayMoveRange', handleHighlights);
    gameSocket.on('game:server:displayAbilityRange', handleSelectables);
    gameSocket.connect();
  },

  cleanupSocketListeners: () => {
    gameSocket.off('connect');
    gameSocket.off('disconnect');
    gameSocket.off('game:server:join');
    gameSocket.off('game:server:init');
    gameSocket.off('game:server:sync');
    gameSocket.off('game:server:globalSync');
    gameSocket.disconnect();
  },
}
));
