import TinyQueue from 'tinyqueue';
import { testMap, parseMap } from './maps';
import type { pos, player, enemy, mapInfo, serverGameState } from './types';

export const gameState: serverGameState = {
  phase: 'PLAN',
  turn: 1,
  players: {},
  clones: {},
  enemies: {},
  tiles: {},
  clients: {},
  history: [],
  mapBounds: { width: 0, height: 0, depth: 0 },
};

export function initClientGameState(id: string) {
  return ({
    id: id,
    highlights: {},
    selectables: {},
    canSelect: true,
    selectedAb: null,
    selectedEnt: null,
    selectedDice: null,
  })
}

export async function moveTo(entId: string, tileId: string) {
  const [x, y, z] = tileId.split(',').map(Number);
  const dest = { x, y: (y + 1), z };
  let ent = gameState.players[entId] || gameState.clones[entId] || gameState.enemies[entId];
  if (!ent)
    return;
  const path = Astar(ent.position, dest);
  if (!path || path.length === 0)
    return;
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  for (let i = 1; i < path.length; ++i) {
    await sleep(300);
    const [sx, sy, sz] = path[i].split(',').map(Number);
    const stepPos = { x: sx, y: sy, z: sz };
    if (ent.type === "player")
      gameState.players[entId].position = stepPos;
    if (ent.type === "enemy")
      gameState.enemies[entId].position = stepPos;
  }
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

export function hasLoS(pos: pos, x: number, y: number, z: number) {
  const dx = x - pos.x;
  const dy = y - pos.y;
  const dz = z - pos.z;
  const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
  if (steps < 1)
    return 1;
  let cx = pos.x;
  let cy = pos.y;
  let cz = pos.z;
  for (let i = 1; i < steps; i++) {
    cx += dx / steps;
    cy += dy / steps;
    cz += dz / steps;
    const rx = Math.round(cx);
    const ry = Math.round(cy);
    const rz = Math.round(cz);
    if (isBlocked(rx, ry, rz))
      return -1;
  }
  if (checkEnt(x, y, z))
    return 0;
  if (isBlocked(x, y, z))
    return -1;
  return 1;
}

export function isValid(x: number, y: number, z: number) {
  return (x >= gameState.mapBounds.width || y >= gameState.mapBounds.height + 1
    || z >= gameState.mapBounds.depth || x < 0 || y < 0 || z < 0 ? false : true)
}

export function crossTiles(pos: pos, range: number) {
  const CROSS = [
    [1, 0, 0], [-1, 0, 0],
    [0, 0, 1], [0, 0, -1],
  ];
  const valid: Record<string, boolean> = {};
  for (const [dx, dy, dz] of CROSS) {
    for (let n = 1; n <= range; ++n) {
      const x = pos.x + n * dx;
      const y = pos.y + n * dy;
      const z = pos.z + n * dz;
      if (!isValid(x, y, z) || gameState.tiles[`${x},${y},${z}`])
        break;
      const ent = checkEnt(x, y, z);
      if (ent) {
        valid[ent.id] = true;
        break;
      }
      valid[`${x},${y - 1},${z}`] = true;
    }
  }
  return (valid);
}

function euclidTiles(pos: pos, range: number, is3D: boolean) {
  const hmax = is3D ? range : 0;
  const hmin = is3D ? -range : 0;
  const valid: Record<string, boolean> = {};
  for (let dx = -range; dx <= range; ++dx) {
    for (let dy = hmin; dy <= hmax; ++dy) {
      for (let dz = -range; dz <= range; ++dz) {
        const x = pos.x + dx;
        const y = pos.y + dy;
        const z = pos.z + dz;
        if (!isValid(x, y, z) || gameState.tiles[`${x},${y},${z}`]
          || (range * range < dx * dx + dy * dy + dz * dz))
          continue;
        const resLoS = hasLoS(pos, x, y, z);
        if (resLoS === -1)
          continue;
        if (resLoS === 0) {
          const entid = checkEnt(x, y, z)?.id;
          if (entid)
            valid[entid] = true;
          continue;
        }
        valid[`${x},${y - 1},${z}`] = true;
      }
    }
  }
  return (valid);
}

export function paint(who: string, pos: pos, type: string, range: number, self: boolean) {
  if (!gameState.clients[who].selectedEnt)
    return {};
  let valid: Record<string, boolean>;
  switch (type) {
    case 'cross':
      valid = crossTiles(pos, range);
      break;
    case 'circle':
      valid = euclidTiles(pos, range, false);
      break;
    case 'sphere':
      valid = euclidTiles(pos, range, true);
      break;
    default:
      valid = {};
  }
  valid[gameState.clients[who].selectedEnt] = false;
  if (self)
    valid[gameState.clients[who].selectedEnt] = true;
  return (valid);
}

export function getAbility(name: string) {
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
        effect: ["bleed", "1"],
      }
    case "Dagger Throw":
      return {
        name: name,
        type: "cross",
        effect: ["bleed", "1"],
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
        effect: ["move", "away"],
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
        effect: ["restrain", "2"],
        cond: (x: number) => x > 2,
        range: 3,
        dmg: 1,
        cd: 0,
        self: false,
      }
    case "Thrust":
      return {
        name: name,
        type: "cross",
        cond: (x: number) => x > 3,
        range: 2,
        dmg: 2,
        cd: 1,
        self: false,
      }
    case "Defend":
      return {
        name: name,
        type: "circle",
        effect: ["defend", "2"],
        cond: (x: number) => x > 2,
        range: 2,
        dmg: 0,
        cd: 0,
        self: false,
      }
    case "Shield Bash":
      return {
        name: name,
        type: "cross",
        effect: ["move", "away"],
        cond: (x: number) => x > 5,
        range: 0,
        dmg: 4,
        cd: 2,
        AoE: "circle",
        AoErange: 2,
        self: true,
      }
    case "Vertical Slash":
      return {
        name: name,
        type: "cross",
        cond: (x: number) => x > 3,
        range: 1,
        dmg: (bonus: number) => 1 + bonus,
        cd: 1,
        AoE: "vertical",
        AoErange: 1,
        self: false,
      }
    case "Fire Breath":
      return {
        name: name,
        type: "cone",
        effect: ["burn", "2"],
        cond: (x: number) => x > 3,
        range: 3,
        dmg: (res: number) => Math.floor(res / 3),
        cd: 2,
        self: false,
      }
    case "Azure Comet":
      return {
        name: name,
        type: "cross",
        cond: (x: number) => x > 3,
        range: 5,
        dmg: (res: number) => Math.floor(res / 2) + 2,
        cd: 3,
        self: false,
      }
    case "Small Meteor":
      return {
        name: name,
        type: "smcircle",
        cond: (x: number) => x > 2,
        range: 4,
        dmg: (bonus: number) => 1 + bonus,
        cd: 1,
        self: false,
      }
    case "Rising Thorns":
      return {
        name: name,
        type: "rtcircle",
        cond: (x: number) => x > 2,
        range: 4,
        dmg: (bonus: number) => 1 + bonus,
        cd: 1,
        self: false,
      }
    case "Stimulant":
      return {
        name: name,
        type: "cross",
        effect: ["bonus dice", "1"],
        cond: (x: number) => x > 2,
        range: 2,
        dmg: 0,
        cd: 0,
        self: true,
      }
    case "Vacuum Flask":
      return {
        name: name,
        type: "circle",
        effect: ["move", "towards"],
        cond: (x: number) => x > 2,
        range: 3,
        dmg: 1,
        cd: 0,
        self: false,
      }
    case "Bombastic Flask":
      return {
        name: name,
        type: "circle",
        effect: ["move", "away"],
        cond: (x: number) => x > 2,
        range: 2,
        dmg: (res: number) => Math.floor(res / 2) - 2,
        cd: 0,
        self: false,
      }
    case "Oxidation":
      return {
        name: name,
        type: "circle",
        effect: ["oxidation", "2"],
        cond: (x: number) => x > 2,
        range: 2,
        dmg: 0,
        cd: 0,
        self: false,
      }
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
}

export function checkEnt(x: number, y: number, z: number) {
  const entities = [
    ...Object.values(gameState.players),
    ...Object.values(gameState.enemies),
    ...Object.values(gameState.clones),
  ];

  return entities.find((e) =>
    e.position.x === x
    && e.position.y === y
    && e.position.z === z);
}

export function isOOB(x: number, y: number, z: number) {
  if (x < 0 || y < 0 || z < 0 || x >= gameState.mapBounds.width
    || y >= gameState.mapBounds.height + 1 || z >= gameState.mapBounds.depth)
    return true;
  return false;
}

export function isBlocked(x: number, y: number, z: number) {
  const key = `${x},${y},${z}`;
  return (gameState.tiles[key] || checkEnt(x, y, z) ? true : false);
}

export function hasFloor(x: number, y: number, z: number) {
  return (y - 1 < 0 || (isBlocked(x, y - 1, z)
    && !checkEnt(x, y - 1, z)) ? true : false)
}

export function dijkstra(pos: pos, maxCost: number) {
  const initial = `${pos.x},${pos.y},${pos.z}`;
  const MOV = [
    [1, 0, 0], [-1, 0, 0],
    [0, 0, 1], [0, 0, -1],
    [1, 1, 0], [-1, 1, 0],
    [0, 1, 1], [0, 1, -1],
    [1, -1, 0], [-1, -1, 0],
    [0, -1, 1], [0, -1, -1],
  ];
  const dist: Record<string, number> = { [initial]: 0 };
  const nodes = new TinyQueue<{ key: string; d: number }>([], (a, b) => a.d - b.d);
  nodes.push({ key: initial, d: 0 });
  while (nodes.length > 0) {
    const { key, d } = nodes.pop()!;
    if (d > (dist[key] ?? Infinity))
      continue;
    if (d > maxCost)
      break;
    const [x, y, z] = key.split(",").map(Number);
    for (const [dx, dy, dz] of MOV) {
      const nx = x + dx;
      const ny = y + dy;
      const nz = z + dz;
      if (isOOB(nx, ny, nz) || isBlocked(nx, ny, nz)
        || !hasFloor(nx, ny, nz))
        continue;
      const stepCost = dy === 1 ? 2 : 1;
      const newCost = d + stepCost;
      const nkey = `${nx},${ny},${nz}`;
      if (newCost < (dist[nkey] ?? Infinity)) {
        dist[nkey] = newCost;
        nodes.push({ key: nkey, d: newCost });
      }
    }
  }
  const reachable: string[] = [];
  for (const key in dist) {
    if (dist[key] <= maxCost && key !== initial) {
      const [x, y, z] = key.split(",").map(Number);
      reachable.push(`${x},${y - 1},${z}`);
    }
  }
  return reachable;
}

export function Astar(src: pos, dest: pos) {
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
      if (isOOB(nx, ny, nz) || isBlocked(nx, ny, nz) || !hasFloor(nx, ny, nz))
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
}
