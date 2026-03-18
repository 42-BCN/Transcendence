import { create } from "zustand";
import TinyQueue from "tinyqueue";
import type { parse_entity, pos, tile } from "./maps";


type player = parse_entity & {
  hp: number;
  maxHp: number;
  abilities: string[];
  dice: number[];
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

type historyAction = {
  who: string;
  type: string;
  abilities: string;
}

type gameState = {
  turn: number;
  executeTurn: boolean;
  canSelect: boolean;
  typeEnt: string | null;
  selectedAb: string | null;
  selectedEnt: string | null;
  players: Record<string, entity>;
  enemies: Record<string, entity>;
  obstacles: Record<string, boolean>;
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  history: historyAction[];
  mapBounds: mapInfo;


  nextTurn: () => void;
  selectEntity: (Id: string) => void;
  getSel: () => entity | undefined;
  movDice: (maxNum: number) => void;
  addHistory: (action: historyAction) => void;
  moveTo: (tileId: string) => Promise<void>;
  changeMode: () => void;
  init: (entities: parse_entity[], tiles: tile[], mapInfo: mapInfo) => void;
  checkEnt: (x: number, y: number, z: number) => entity | undefined;
  isOOB: (x: number, y: number, z: number) => boolean;
  isBlocked: (x: number, y: number, z: number) => boolean;
  hasFloor: (x: number, y: number, z: number) => boolean;
  dijkstra: (pos: pos, maxCost: number) => string[];
  Astar: (src: pos, dest: pos) => string[] | undefined;
  euclidTiles: (pos: pos, range: number, is3D: boolean, self: boolean) => void;
  isValid: (x: number, y: number, z: number) => boolean;
  crossTiles: (pos: pos, range: number, self: boolean) => void;
  paint: (pos: pos, type: string, range: number, self: boolean) => void;
  selectAbility: (name: string) => void;
}

export const useGame = create<gameState>()((set, get) => ({
  turn: 1,
  executeTurn: false,
  canSelect: true,
  typeEnt: null,
  selectedAb: null,
  selectedEnt: null,
  players: {},
  enemies: {},
  obstacles: {},
  highlights: {},
  selectables: {},
  history: [],
  mapBounds: { width: 0, height: 0, depth: 0 },

  nextTurn: () => set((state) => (
    { turn: state.turn + 1 }
  )),

  selectEntity: (Id) =>
    set((state) => {
      if (Id === state.selectedEnt) {
        return {
          selectedEnt: null,
          typeEnt: null,
          selectedAb: null,
          highlights: {},
          selectables: {},
        };
      }
      let ent = state.players[Id];
      if (!ent)
        ent = state.enemies[Id];
      return {
        selectedEnt: ent.id,
        typeEnt: ent.type,
        selectedAb: null,
        highlights: {},
        selectables: {}
      };
    }),
  getSel: () => {
    const s = get();
    if (!s.selectedEnt)
      return;
    return (s.typeEnt === "player" ? s.players[s.selectedEnt] : s.enemies[s.selectedEnt])
  },

  movDice: (maxNum) => {
    const state = get();
    const ent = state.getSel();
    if (!ent)
      return;
    const hlId = state.dijkstra(ent.position, maxNum);
    const hlTiles: Record<string, boolean> = {};
    hlId.forEach((id: string) => (hlTiles[id] = true));
    set({ highlights: hlTiles });
  },

  addHistory: (action) => set((state) => {
    const len = state.history.length;
    const newHistory = [...state.history];
    for (let i = 0; i < len; ++i) {
      if (action.who !== newHistory[i].who)
        continue;
      if (action.type === "abilities") {
        newHistory[i].abilities = action.abilities;
        return { history: newHistory };
      }
      newHistory.splice(i, 1);
      break;
    }
    newHistory.push(action);
    return { history: newHistory };
  }),

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
      return;
    const path = state.Astar(ent.position, dest);
    if (!path || path.length === 0)
      return;
    set({
      highlights: {},
      selectedEnt: null,
      canSelect: false
    })
    for (let i = 1; i < path.length; ++i) {
      await sleep(300);
      const [sx, sy, sz] =
        path[i].split(',').map(Number);
      const stepPos =
        { x: sx, y: sy, z: sz };
      set((currState) => {
        if (currState.typeEnt === "player") {
          return {
            players:
            {
              ...currState.players,
              [ent.id]: {
                ...currState.players[ent.id],
                position: stepPos
              }
            }
          }
        }
        return {
          enemies:
          {
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

  changeMode: () => set((state) => (
    { executeTurn: !state.executeTurn })),

  init: (entities, tiles, mapInfo) => {
    const playEnt: Record<string, player> = {};
    const enemEnt: Record<string, enemy> = {};
    const worldMap: Record<string, boolean> = {};
    const mapBounds = {};

    tiles.forEach((obstacle) => {
      worldMap[obstacle.id] = true;
    });
    entities.forEach((entity) => {
      if (entity.type === "player") {
        playEnt[entity.id] = {
          ...entity, type: "player", hp: 13, maxHp: 13,
          abilities: ["Stab", "Dagger Throw", "Kick", "Restrain"],
          dice: [4, 4, 4, 4, 8]
        }
      }
      if (entity.type === "enemy") {
        enemEnt[entity.id] = {
          ...entity, type: "enemy", hp: 13, maxHp: 13,
          abilities: ["Stab", "Dagger Throw", "Kick", "Restrain"],
          dice: [4]
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
      if (dist[key] <= maxCost) {
        const [x, y, z] =
          key.split(",").map(Number);
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
    const destKey =
      `${dest.x},${dest.y},${dest.z}`
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

        if (state.isOOB(nx, ny, nz) || state.isBlocked(nx, ny, nz)
          || !state.hasFloor(nx, ny, nz))
          continue;
        const newG = node.g +
          (dy === 1 ? 2 : 1)
        const Id = `${nx},${ny},${nz}`;
        if (Closed.has(Id))
          continue;
        if (bestG[Id] === undefined
          || newG < bestG[Id]) {
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

  euclidTiles: (pos, range, is3D, self) => {
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
            || (dx === 0 && dy === 0 && dz === 0)
            || (range * range < dx * dx + dy * dy + dz * dz))
            continue;
          const ent = state.checkEnt(x, y, z);
          if (ent) {
            valid[ent.id] = true;
            continue;
          }
          valid[
            `${x},${y - 1},${z}`] = true;
        }
      }
    }
    if (self && state.selectedEnt)
      valid[state.selectedEnt] = true;
    set({ selectables: valid });
  },

  isValid: (x, y, z) => {
    const state = get()
    return (x >= state.mapBounds.width || y >= state.mapBounds.height + 1
      || z >= state.mapBounds.depth || x < 0 || y < 0 || z < 0 ? true : false)
  },

  crossTiles: (pos, range, self) => {
    const state = get();
    const CROSS = [
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1]
    ];
    const valid: Record<string, boolean> = {};
    for (let n = 1; n <= range; ++n) {
      for (const [dx, dy, dz] of CROSS) {
        const x = pos.x + n * dx;
        const y = pos.y + n * dy;
        const z = pos.z + n * dz;
        if (!state.isValid(x, y, z) || state.obstacles[`${x},${y},${z}`])
          continue;
        const ent = state.checkEnt(x, y, z);
        if (ent) {
          valid[ent.id] = true;
          continue;
        }
        valid[`${x},${y - 1},${z}`] = true;
      }
    }
    if (state.selectedEnt && self)
      valid[state.selectedEnt] = true;
    set({ selectables: valid });
  },

  paint: (pos, type, range, self) => {
    const state = get()
    switch (type) {
      case 'cross':
        state.crossTiles(pos, range, self);
        break;
      case 'circle':
        state.euclidTiles(pos, range, false, self);
        break;
      case 'sphere':
        state.euclidTiles(pos, range, true, self);
        break;
    }
  },

  selectAbility: (name) => {
    const state = get()
    set(
      {
        selectedAb: name,
        highlights: {}
      });
    const pos = state.players['player_1'].position;
    state.paint(pos, 'cross', 3, true);
  },

  unselectAbility: () => {
    set({ selectedAb: null, selectables: {} })
  }
}));
