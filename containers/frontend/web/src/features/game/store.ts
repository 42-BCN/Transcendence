import { create } from "zustand";
import TinyQueue from "tinyqueue";
import type { parse_entity, pos, tile } from "./maps";


type player = parse_entity & {
  hp: number;
  maxHp: number;
  status: string | null;
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
  AoErange?: string;
  effect?: string;
}

type gameState = {
  turn: number;
  players: Record<string, entity>;
  enemies: Record<string, entity>;
  clones: Record<string, entity>;
  history: historyAction[];
  typeEnt: string | null;
  mapBounds: mapInfo;

  executeTurn: boolean;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  obstacles: Record<string, boolean>;
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  affected: Record<string, boolean>;
  selectedDice: number | null;

  nextTurn: () => void;
  selectEntity: (Id: string) => void;
  getSel: () => entity | undefined;
  movDice: (mov: number) => void;
  selectDice: (dice: number) => void;
  addHistory: (who: string, type: string, target: string, dice?: number, ability?: string) => void;
  resetHistory: (id: string) => void;
  addHistoryAbility: (target: string) => void;
  moveTo: (tileId: string) => Promise<void>;
  moveClone: (tileId: string) => void;
  changeTurnStage: () => void;
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
  getAbility: (name: string) => abilityInfo;
  executeAbility: (who: string, which: string, target: string) => void;
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
};

export const useGame = create<gameState>()((set, get) => ({
  turn: 1,
  executeTurn: false,
  canSelect: true,
  typeEnt: null,
  selectedAb: null,
  selectedEnt: null,
  selectedDice: null,
  players: {},
  enemies: {},
  clones: {},
  obstacles: {},
  highlights: {},
  selectables: {},
  affected: {},
  history: [],
  mapBounds: { width: 0, height: 0, depth: 0 },

  nextTurn: () => set((state) => (
    { turn: state.turn + 1 }
  )),


  selectEntity: (id) =>
    set((state) => {
      if (id === state.selectedEnt) {
        return clean;
      }
      let ent = state.players[id] || state.enemies[id] || state.clones[id];
      if (!ent)
        throw new Error("cannot select entity!");
      console.log("ent.id: ", ent.id);
      return {
        ...clean,
        selectedEnt: ent.id,
        typeEnt: ent.type,
      };
    }),
  getSel: () => {
    const s = get();
    if (!s.selectedEnt)
      return;
    const id = s.selectedEnt;
    return (s.players[id] || s.enemies[id] || s.clones[id]);
  },

  movDice: (mov) => {
    const state = get();
    const ent = state.getSel();
    if (!ent)
      throw new Error("no ent id!");
    if (ent.hasMoved === true)
      return;
    const hlId = state.dijkstra(ent.position, mov);
    const hlTiles: Record<string, boolean> = {};
    hlId.forEach((id: string) => (hlTiles[id] = true));
    set({
      highlights: hlTiles,
      selectedDice: mov,
    });
  },

  selectDice: (dice) => {
    const state = get()
    if (state.selectedDice === dice) {
      set({ selectedDice: null });
      return;
    }
    const entid = state.selectedEnt;
    if (!entid)
      throw new Error("no ent id!");
    set({ selectedDice: dice });
    console.log("selectedDice: ", get().selectedDice);
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
        },
      },
      clones: { ...remainingClones },
    });
  },

  addHistory: (id, type, target, dice = 0, ability = "") => set((state) => {
    const len = state.history.length;
    const who = id.startsWith("clone_") ? id.replace("clone_", "") : id;
    //    const ent = state.players[id] || state.enemies[id] || state.clones[id];

    if (len > 4)
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
      newAction.abilities = [...(lastAction.abilities || []), {
        name: ability,
        target: target,
        dice: dice,
        aftermov: lastAction.moveto && id !== who ? true : false
      }];
      // console.log("pasa antes del if: ", lastAction, newAction.abilities.length);
      if (lastAction.moveto && newAction.abilities[newAction.abilities.length - 1]?.aftermov === false) {
        const { [`clone_${who}`]: _, ...remainingClones } = state.clones;
        newHistory.push(newAction);
        console.log("newHistory from inside the clone deletion: ", newHistory);
        return {
          clones: { ...remainingClones },
          history: newHistory
        };
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
    if (state.typeEnt === 'player') {
      return set({
        ...clean,
        players: {
          ...state.players,
          [entid]: {
            ...state.players[entid],
            dice: state.players[entid].dice.toSpliced(
              state.players[entid].dice.indexOf(selectedDice), 1),
            usedDice: [...state.players[entid].usedDice, selectedDice],
          }
        }
      })
    }
    else if (state.typeEnt === 'clone') {
      return set({
        ...clean,
        clones: {
          ...state.clones,
          [entid]: {
            ...state.clones[entid],
            dice: state.clones[entid].dice.toSpliced(
              state.clones[entid].dice.indexOf(selectedDice), 1),
            usedDice: [...state.clones[entid].usedDice, selectedDice].sort((a, b) => a - b),
          }
        }
      })
    }
    throw new Error("Couldn't add ability to history due to typeEnt not being of a valid type!");
  },

  moveClone: (tileId) => {
    const state = get()
    if (!state.highlights[tileId])
      return;
    const [x, y, z] = tileId.split(',').map(Number);
    const dest = { x, y: (y + 1), z };
    let ent = null;
    if (!state.selectedEnt || !state.selectedDice)
      return;
    if (state.typeEnt === "player")
      ent = state.players[state.selectedEnt];
    else if (state.typeEnt === "enemy")
      ent = state.enemies[state.selectedEnt];
    if (!ent)
      throw new Error("no ent id!");
    state.addHistory(state.selectedEnt, "mov", tileId);
    const cloneid = `clone_${ent.id}`;
    set({
      ...clean,
      typeEnt: "clone",
      players: {
        ...state.players,
        [ent.id]: {
          ...state.players[ent.id],
        },
      },
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

  moveTo: async (tileId) => {
    const state = get()
    if (!state.highlights[tileId])
      return;
    const sleep = (ms: number) => new Promise((resolve) =>
      setTimeout(resolve, ms));
    const [x, y, z] = tileId.split(',').map(Number);
    const dest = { x, y: (y + 1), z };
    let ent = null;
    if (!state.selectedEnt)
      return;
    if (state.typeEnt === "player")
      ent = state.players[state.selectedEnt];
    else if (state.typeEnt === "enemy")
      ent = state.enemies[state.selectedEnt];
    if (!ent)
      throw new Error("no ent id!");
    const path = state.Astar(ent.position, dest);
    if (!path || path.length === 0 || !state.selectedDice)
      return;
    state.addHistory(state.selectedEnt, "mov", tileId);
    const cloneid = `clone_${ent.id}`;
    set({
      ...clean,
      typeEnt: "clone",
      canSelect: false,
      players: {
        ...state.players,
        [ent.id]: {
          ...state.players[ent.id],
        },
      },
      clones: {
        ...state.clones,
        [cloneid]: {
          ...state.players[ent.id],
          type: "clone",
          id: cloneid,
          dice: state.players[ent.id].dice.toSpliced(
            state.players[ent.id].dice.indexOf(state.selectedDice), 1),
          usedDice: [...state.players[ent.id].usedDice, state.selectedDice].sort((a, b) => a - b),
          hasMoved: true
        }
      }
    });
    for (let i = 1; i < path.length; ++i) {
      await sleep(300);
      const [sx, sy, sz] = path[i].split(',').map(Number);
      const stepPos = { x: sx, y: sy, z: sz };
      set((currState) => {
        if (currState.typeEnt === "clone") {
          return {
            clones: {
              ...currState.clones,
              [cloneid]: {
                ...currState.clones[cloneid],
                position: stepPos
              }
            }
          }
        }
        return {
          enemies: {
            ...currState.enemies,
            [ent.id]: {
              ...currState.enemies[ent.id],
              position: stepPos
            }
          }
        };
      });
    }
    set(
      { canSelect: true }
    );
  },

  changeTurnStage: () => {
    console.log("turn changed")
    set((state) => ({
      executeTurn: !state.executeTurn,
      canSelect: false,
    }))

  },

  init: (entities, tiles, mapInfo) => {
    const playEnt: Record<string, player> = {};
    const enemEnt: Record<string, enemy> = {};
    const worldMap: Record<string, boolean> = {};

    tiles.forEach((obstacle) => {
      worldMap[obstacle.id] = true;
    });
    entities.forEach((entity) => {
      switch (entity.type) {
        case "assassin":
          playEnt[entity.id] = {
            ...entity, type: "player", hp: 13, maxHp: 13,
            abilities: ["Stab", "Dagger Throw", "Kick", "Restrain"],
            dice: [4, 4, 4, 4, 8],
            usedDice: [],
            facing: "center",
            status: null,
            hasMoved: false,
          }
          break;
        case "paladin":
          playEnt[entity.id] = {
            ...entity, type: "player", hp: 16, maxHp: 16,
            abilities: ["Thrust", "Defend", "Shield Bash", "Vertical Slash"],
            dice: [6, 6, 6, 6],
            usedDice: [],
            facing: "center",
            status: null,
            hasMoved: false,
          }
          break;
        case "mage":
          playEnt[entity.id] = {
            ...entity, type: "player", hp: 8, maxHp: 8,
            abilities: ["Fire Breath", "Azure Comet", "Small Meteor", "Rising Thorns"],
            dice: [4, 8, 12],
            usedDice: [],
            facing: "center",
            status: null,
            hasMoved: false,
          }
          break;
        case "scientist":
          playEnt[entity.id] = {
            abilities: ["Stimulant", "Vacuum Flask", "Bombastic Flask", "Oxidation"],
            ...entity, type: "player", hp: 10, maxHp: 10,
            dice: [6, 8, 10],
            usedDice: [],
            facing: "center",
            status: null,
            hasMoved: false,
          }
          break;
      }
      if (entity.type === "enemy") {
        enemEnt[entity.id] = {
          ...entity, type: "enemy", hp: 13, maxHp: 13,
          abilities: ["Claw"],
          dice: [4],
          usedDice: [],
          facing: "center",
          status: null,
          hasMoved: false,
        }
      }
    });
    set({
      players: playEnt,
      enemies: enemEnt,
      obstacles: worldMap,
      mapBounds: mapInfo,
    });
  },

  checkEnt: (x, y, z) => {
    const state = get();
    const entities = [
      ...Object.values(state.players),
      ...Object.values(state.enemies),
      ...Object.values(state.clones),
    ];

    return entities.find((e) =>
      e.position.x === x
      && e.position.y === y
      && e.position.z === z);
  },

  isOOB: (x, y, z) => {
    const state = get();
    if (x < 0 || y < 0 || z < 0 || x >= state.mapBounds.width
      || y >= state.mapBounds.height + 1 || z >= state.mapBounds.depth)
      return true;
    return false;
  },

  isBlocked: (x, y, z) => {
    const state = get();
    const key = `${x},${y},${z}`;
    return (state.obstacles[key] || state.checkEnt(x, y, z) ? true : false);
  },

  hasFloor: (x, y, z) => {
    const state = get();
    return (y - 1 < 0 || (state.isBlocked(x, y - 1, z)
      && !state.checkEnt(x, y - 1, z)) ? true : false)
  },

  dijkstra: (pos, maxCost) => {
    const state = get();
    const max = {
      x: Math.min(state.mapBounds.width, pos.x + maxCost),
      y: state.mapBounds.height + 1,
      z: Math.min(state.mapBounds.depth, pos.z + maxCost)
    }
    const min = {
      x: Math.max(0, pos.x - maxCost),
      y: 0,
      z: Math.max(0, pos.z - maxCost)
    }
    const initial = `${pos.x},${pos.y},${pos.z}`;
    const nodes = [];
    const dist: Record<string, number> = {};
    const MOV = [
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1],
      [1, 1, 0], [-1, 1, 0],
      [0, 1, 1], [0, 1, -1],
      [1, -1, 0], [-1, -1, 0],
      [0, -1, 1], [0, -1, -1]
    ];
    nodes.push(initial)
    for (let z = min.z; z < max.z; ++z) {
      for (let y = min.y; y < max.y; ++y) {
        for (let x = min.x; x < max.x; ++x) {
          if (state.isBlocked(x, y, z) || !state.hasFloor(x, y, z))
            continue;
          const key = `${x},${y},${z}`;
          dist[key] = Infinity;
          nodes.push(key);
        }
      }
    }
    dist[initial] = 0;
    const visited = new Set();
    while (visited.size < nodes.length) {
      let bestDist = Infinity;
      let bestKey = null;
      for (const key of nodes) {
        if (visited.has(key))
          continue;
        if (dist[key] < bestDist) {
          bestDist = dist[key];
          bestKey = key;
        }
      }
      if (bestDist > maxCost || bestKey === null)
        break;
      visited.add(bestKey);
      const [x, y, z] =
        bestKey.split(",").map(Number);
      for (const [dx, dy, dz] of MOV) {
        const nx = x + dx;
        const ny = y + dy;
        const nz = z + dz;

        if (state.isBlocked(nx, ny, nz) || !state.hasFloor(nx, ny, nz))
          continue;
        const nkey = `${nx},${ny},${nz}`;
        if (!(nkey in dist))
          continue;

        let stepCost = 1;
        if (dy === 1) stepCost += 1;
        const newCost =
          dist[bestKey] + stepCost;
        if (newCost < dist[nkey])
          dist[nkey] = newCost;
      }
    }
    const reachable = [];
    for (const key in dist) {
      if (dist[key] <= maxCost && key !== initial) {
        const [x, y, z] = key.split(",").map(Number);
        reachable.push(`${x},${y - 1},${z}`);
      }
    }
    return reachable;
  },
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

  hasLoS: (pos, x, y, z) => {
    const dx = x - pos.x;
    const dy = y - pos.y;
    const dz = z - pos.z;
    const state = get();
    const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
    if (steps < 1)
      return 1;
    let cx = pos.x;
    let cy = pos.y;
    let cz = pos.z;
    for (let i = 1; i < steps; i++) {
      cx += dx / steps;;
      cy += dy / steps;;
      cz += dz / steps;;
      const rx = Math.round(cx);
      const ry = Math.round(cy);
      const rz = Math.round(cz);
      if (state.isBlocked(rx, ry, rz))
        return -1;
    }
    if (state.checkEnt(x, y, z))
      return 0;
    if (state.isBlocked(x, y, z))
      return -1;
    return 1;
  },

  euclidTiles: (pos, range, is3D) => {
    const state = get();
    const hmax = is3D ? range : 0;
    const hmin = is3D ? -range : 0;
    const valid: Record<string, boolean> = {};
    for (let dx = -range; dx <= range; ++dx) {
      for (let dy = hmin; dy <= hmax; ++dy) {
        for (let dz = -range; dz <= range; ++dz) {
          const x = pos.x + dx;
          const y = pos.y + dy;
          const z = pos.z + dz;
          if (!state.isValid(x, y, z) || state.obstacles[`${x},${y},${z}`]
            || (range * range < dx * dx + dy * dy + dz * dz))
            continue;
          const resLoS = state.hasLoS(pos, x, y, z);
          if (resLoS === -1)
            continue;
          if (resLoS === 0) {
            const entid = state.checkEnt(x, y, z)?.id;
            if (entid)
              valid[entid] = true;
            continue;
          }
          valid[`${x},${y - 1},${z}`] = true;
        }
      }
    }
    return (valid);
  },

  isValid: (x, y, z) => {
    const state = get()
    return (x >= state.mapBounds.width || y >= state.mapBounds.height + 1
      || z >= state.mapBounds.depth || x < 0 || y < 0 || z < 0 ? false : true)
  },

  crossTiles: (pos, range) => {
    const state = get();
    const CROSS = [
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1]
    ];
    const valid: Record<string, boolean> = {};
    for (const [dx, dy, dz] of CROSS) {
      for (let n = 1; n <= range; ++n) {
        const x = pos.x + n * dx;
        const y = pos.y + n * dy;
        const z = pos.z + n * dz;
        if (!state.isValid(x, y, z) || state.obstacles[`${x},${y},${z}`])
          break;
        const ent = state.checkEnt(x, y, z);
        if (ent) {
          valid[ent.id] = true;
          break;
        }
        valid[`${x},${y - 1},${z}`] = true;
      }
    }
    return (valid);
  },

  paint: (pos, type, range, self) => {
    const state = get()
    if (!state.selectedEnt)
      return {};
    let valid: Record<string, boolean>;
    switch (type) {
      case 'cross':
        valid = state.crossTiles(pos, range);
        break;
      case 'circle':
        valid = state.euclidTiles(pos, range, false);
        break;
      case 'sphere':
        valid = state.euclidTiles(pos, range, true);
        break;
      default:
        valid = {};
    }
    valid[state.selectedEnt] = false;
    if (self)
      valid[state.selectedEnt] = true;
    return (valid);
  },

  getAbility: (name): abilityInfo => {
    switch (name) {
      case "Stab":
        return {
          name: name,
          type: "cross",
          cond: (x: number) => (x % 2) !== 0,
          range: 1,
          dmg: 1,
          cd: 0,
          self: false,
          effect: "bleed",
        }
      case "Dagger Throw":
        return {
          name: name,
          type: "cross",
          effect: "bleed",
          cond: (x: number) => x > 3,
          range: 3,
          dmg: 1,
          cd: 0,
          self: false,
        }
      case "Kick":
        return {
          name: name,
          type: "cross",
          effect: "push",
          cond: (x: number) => x > 2,
          range: 1,
          dmg: 1,
          cd: 0,
          self: false,
        }
      case "Restrain":
        return {
          name: name,
          type: "circle",
          effect: "restrain",
          cond: (x: number) => x > 2,
          range: 3,
          dmg: 1,
          cd: 0,
          self: false,
        }
      // case "Thrust":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Defend":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Shield Bash":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Vertical Slash":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Fire Breath":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Azure Comet":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Small Meteor":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Rising Thorns":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Stimulant":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Vacuum Flask":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Bombastic Flask":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      // case "Oxidation":
      //   return {
      //     name: name,
      //     type: "circle",
      //     effect: "restrain",
      //     cond: (x: number) => x > 2,
      //     range: 3,
      //     dmg: 1,
      //     cd: 0,
      //     self: false,
      //   }
      default:
        return {
          name: "error",
          type: "sphere",
          cond: (x: number) => x > 2,
          range: 3,
          dmg: 1,
          cd: 0,
          self: true,
        }
    }
  },

  selectAbility: (name) => {
    const state = get()
    if (state.selectedAb === name)
      return set(clean);
    const entid = state.selectedEnt;
    if (!entid)
      throw new Error("no ent id!");
    const pos = state.getSel()?.position;
    if (!pos)
      throw new Error("no position!");
    const { type, range, self } = state.getAbility(name);
    set({
      selectedAb: name,
      highlights: {},
      selectedDice: null,
      selectables: state.paint(pos, type, range, self),
      canSelect: false
    });
    console.log("SelectedAb: ", get().selectedAb);
    console.log("Selectables: ", get().selectables);
  },

  takeAb: (id, type, ab, roll) => {
    const state = get();
    const target = type === "enemy" ? { ...state.enemies[id] } : { ...state.players[id] };

    target.hp = target.hp - (typeof ab.dmg === 'function' ? ab.dmg(roll) : ab.dmg);;
    if (target.hp < 0)
      target.hp = 0;
    if (!target.status && ab.effect)
      target.status = ab.effect;
    return (target);
  },

  executeAbility: (who, which, target) => {
    const state = get();
    const name = state.selectedAb;
    const ent = state.getSel();
    if (!which || !who)
      return;
    const ab = state.getAbility(who);
    if (!state.selectedDice || !ent)
      throw new Error("No selected dice!");
    const roll = Math.ceil(Math.random() * state.selectedDice);
    if (!ab.cond(roll))
      return set({
        ...clean,
        players: {
          ...state.players,
          [ent.id]: {
            ...state.players[ent.id],
            dice: state.players[ent.id].dice.toSpliced(
              state.players[ent.id].dice.indexOf(state.selectedDice), 1),
            usedDice: [...state.players[ent.id].usedDice, state.selectedDice],
          }
        }
      });
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
      ...clean,
      players: {
        ...state.players,
        ...Object.fromEntries(changedPlayers.map(p => [p.id, p])),
        [ent.id]: {
          ...state.players[ent.id],
          dice: state.players[ent.id].dice.toSpliced(
            state.players[ent.id].dice.indexOf(state.selectedDice), 1),
          usedDice: [...state.players[ent.id].usedDice, state.selectedDice],
        }
      },
      enemies: { ...state.enemies, ...Object.fromEntries(changedEnemies.map(e => [e.id, e])) },
    })
  }
}
));
