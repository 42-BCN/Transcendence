import TinyQueue from 'tinyqueue';
import { testMap, parseMap } from './maps';
import type { pos, player, enemy, serverGameState, node, historyAction, abilityInfo } from './types';

const STATUS_TYPE = 0;
const N_TURNS = 1;

export const gameState: serverGameState = {
  phase: 'PLAN',
  turn: 1,
  players: {},
  ghosts: {},
  clones: {},
  enemies: {},
  tiles: {},
  clients: {},
  history: [],
  vfx: [],
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

export function setClear(id: string) {
  if (!gameState?.clients[id])
    return;
  gameState.clients[id].highlights = {};
  gameState.clients[id].selectables = {};
  gameState.clients[id].canSelect = true;
  gameState.clients[id].selectedAb = null;
  gameState.clients[id].selectedDice = null;
}

export function phaseClean() {
  for (const id in gameState.clients) {
    if (!gameState?.clients[id])
      continue;
    gameState.clients[id].highlights = {};
    gameState.clients[id].selectables = {};
    gameState.clients[id].canSelect = false;
    gameState.clients[id].selectedAb = null;
    gameState.clients[id].selectedEnt = null;
    gameState.clients[id].selectedDice = null;
  }
}

export async function nextPhase(sync: () => void) {
  if (gameState.phase !== 'PLAN')
    return console.log('nextPhase tried to execute with phase', gameState.phase);
  phaseClean();
  gameState.phase = 'EXEC';
  sync();
  try {
    await executionPhase(sync);
    phaseClean();
    gameState.phase = 'ENEMY';
    await enemyPhase(sync);
    phaseClean();
    gameState.phase = 'END';
    await endTurn(sync);
    for (const id in gameState.clients)
      setClear(id);
  } catch (err) {
    console.error('Turn resolution failed:', err);
    gameState.phase = 'PLAN';
    for (const id in gameState.clients)
      setClear(id);
  }
}

export async function executionPhase(sync: () => void) {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  for (const id in gameState.ghosts) {
    gameState.players[id] = {
      ...gameState.ghosts[id],
      abilitiesCD: {
        ...gameState.ghosts[id].abilitiesCD,
        ...(gameState.clones[`clone_${id}`]?.abilitiesCD ?? {}),
      },
    };
  }
  gameState.ghosts = {};
  gameState.clones = {};
  for (const action of gameState.history) {
    if (action.type === "ability" && action.abName) {
      executeAbility(action.who, action.abName, action.target, action.dice);
      sync();
      await sleep(400);
    }
    else if (action.type === "mov")
      await moveTo(action.who, action.target, sync);
  }
}

export async function enemyPhase(sync: () => void) {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  console.log('Enemy turn');
  sync();
  await sleep(1000);
  // TODO: check if can attack the closest player

  // TODO: pathfinding including the range of the moves

  // TODO: move Selection
}

export async function endTurn(sync: () => void) {
  sync();
  const entities = { ...gameState.players, ...gameState.enemies }
  Object.keys(entities).forEach((id) => {
    const ent = entities[id];
    if (!ent)
      return console.log('no ent in end turn');
    updateCooldowns(ent.id);
    if (ent.isDead) {
      if (ent.type === 'player')
        delete gameState.players[id];
      else if (ent.type === 'enemy')
        delete gameState.enemies[id];
    }
    else {
      ent.dice = [...ent.dice, ...ent.usedDice].sort((a, b) => a - b);
      ent.usedDice = [];
      ent.hasMoved = false;
    }
  });
  gameState.turn = gameState.turn + 1;
  gameState.phase = 'PLAN';
  gameState.history = [];
  gameState.clones = {};
  sync();
}

export function updateCooldowns(id: string) {
  const ent = gameState.players[id] || gameState.enemies[id];
  if (!ent)
    return (console.log("ent not found in update cooldowns"));
  ent.abilities.forEach((ab) => {
    if (ent.abilitiesCD[ab])
      if (--ent.abilitiesCD[ab] === 0)
        delete ent.abilitiesCD[ab];
  })
}

export function resetHistory(who: string) {
  const deleted = new Set<string>();
  restructureHistory(who, deleted);
  if (gameState.ghosts[who]) {
    gameState.players[who] = { ...gameState.ghosts[who] };
    delete gameState.ghosts[who];
  }
  delete gameState.clones[`clone_${who}`];
  const player = gameState.players[who];
  if (player) {
    gameState.history = gameState.history.filter((a) => !deleted.has(a.id));
    gameState.players[who] = {
      ...player,
      dice: [...player.dice, ...player.usedDice].sort((a, b) => a - b),
      usedDice: [],
      hasMoved: false,
    }
  }
}

export async function moveTo(entId: string, tileId: string, sync: () => void) {
  const [x, y, z] = tileId.split(',').map(Number);
  const dest = { x, y: (y + 1), z };
  let ent = gameState.players[entId] || gameState.enemies[entId];
  if (!ent)
    return;
  const path = Astar(ent.position, dest);
  if (!path || path.length === 0)
    return;
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  for (let i = 0; i < path.length; ++i) {
    await sleep(300);
    const [sx, sy, sz] = path[i].split(',').map(Number);
    const stepPos = { x: sx, y: sy, z: sz };
    if (ent.type === "player")
      gameState.players[entId].position = stepPos;
    else if (ent.type === "enemy")
      gameState.enemies[entId].position = stepPos;
    sync();
  }
}


export function addDisplaceHistory(cause: string, id: string, origin: string, pos: pos, many: number) {
  const [ox, oy, oz] = origin.split(',').map(Number);
  const [dx, dy, dz] = [Math.sign(pos.x - ox),
  Math.sign(pos.y - oy), Math.sign(pos.z - oz)];
  let x = pos.x, y = pos.y, z = pos.z;
  for (let n = 1; n <= many; ++n) {
    const nx = pos.x + n * dx;
    const ny = pos.y + n * dy;
    const nz = pos.z + n * dz;
    if (!isOOB(nx, ny, nz) && !isBlockednc(id, nx, ny, nz) && hasFloor(nx, ny, nz))
      [x, y, z] = [nx, ny, nz];
  }
  while (!hasFloor(x, y--, z));
  moveClone(id, `${x},${y},${z}`, 0);
}

export function manageUndo(action: historyAction, deleted: Set<string>) {
  const who = action.who;
  switch (action.type) {
    case "mov": {
      if (action.dice === 0) {
        const prev = gameState.history.findLast((a) => a.who === who
          && a.type === "mov" && a.id !== action.id && !deleted.has(a.id));
        const ent = gameState.players[who] ?? gameState.clones[`clone_${who}`];
        if (!ent)
          return;
        if (prev) {
          const [px, py, pz] = prev.target.split(',').map(Number);
          ent.position = { x: px, y: py, z: pz };
        }
        else if (gameState.ghosts[who]) {
          ent.position = { ...gameState.ghosts[who].position };
        }
      }
      else {
        if (gameState.ghosts[who])
          gameState.players[who] = { ...gameState.ghosts[who] };
        const player = gameState.players[who];
        if (!player)
          return (console.log("player not found in restructure history"));
        const diceIdx = player.usedDice.indexOf(action.dice);
        if (diceIdx === -1)
          return (console.log("dice error in restructure history"));

        player.hasMoved = false;
        player.usedDice.splice(diceIdx, 1);
        player.dice.push(action.dice);
        player.dice.sort((a, b) => a - b);
        delete gameState.clones[`clone_${who}`];
        delete gameState.ghosts[who];
      }
      break;
    }
    case "ability": {
      const ent = gameState.players[who] ?? gameState.clones[`clone_${who}`];
      if (!ent)
        return (console.log("ent error in restructure history"));
      else if (ent.type === "player") {
        const player = gameState.players[who];
        if (!player)
          return (console.log("player not found in restructure history"));
        const diceIdx = player.usedDice.indexOf(action.dice);
        if (diceIdx === -1)
          return (console.log("dice error in restructure history"));
        player.usedDice.splice(diceIdx, 1);
        player.dice.push(action.dice);
        player.dice.sort((a, b) => a - b);
        if (action.abName)
          delete player.abilitiesCD[action.abName];
      }
      else {
        const clone = gameState.clones[`clone_${who}`];
        if (!clone)
          return (console.log("clones not found in restructure history"));
        const diceIdx = clone.usedDice.indexOf(action.dice);
        if (diceIdx === -1)
          return (console.log("dice error in restructure history"));
        clone.usedDice.splice(diceIdx, 1);
        clone.dice.push(action.dice);
        clone.dice.sort((a, b) => a - b);
        if (action.abName)
          delete clone.abilitiesCD[action.abName];
      }
      break;
    }
  }
}

export function takeAb(id: string, ab: abilityInfo, roll: number) {
  const target = gameState.enemies[id] || gameState.players[id];
  if (!target)
    return console.log('target not found in takeAb');
  // TODO: send signal with the damage dealt to make a html of how much it was done
  target.hp -= (typeof ab.dmg === 'function' ? ab.dmg(roll) : ab.dmg);
  if (target.hp <= 0) {
    target.hp = 0;
    target.usedDice = [...target.dice, ...target.usedDice];
    target.dice = [];
    target.isDead = true;
  }
  const hadStatus = Boolean(target.status);
  if (ab.effect && ab.effect[STATUS_TYPE] && !target.status) {
    target.status = ab.effect[STATUS_TYPE];
    if (target.status !== 'push' && !hadStatus)
      target.statusTurns = Number(ab.effect[N_TURNS]);
  }
}

export function executeAbility(who: string, which: string, target: string, dice: number) {
  if (!which || !who)
    return;
  const ent = gameState.players[who] || gameState.enemies[who] || gameState.clones[who];
  if (!ent)
    throw new Error('No entity found!');
  const ab = getAbility(which);
  const dvalue = dice;
  if (!dvalue)
    throw new Error('No dice value found when executing ability!');
  const roll = Math.ceil(Math.random() * dvalue);
  if (!ab.cond(roll)) return;
  let targets: string[] = [];
  if (!target.includes(','))
    targets = [target];
  if (ab.AoE)
    targets = [...new Set([...targets, ...getAoE(who, target, ab.AoE, ab.AoErange)])];
  targets.forEach((id) => takeAb(id, ab, roll));
}

export function restructureHistory(id: string, deleted: Set<string>, until: number = -1) {
  if (until === -1)
    until = gameState.history.findIndex(action => action.who === id);
  if (until === -1)
    return (console.log("restructure history didn't finish"));
  for (let i = gameState.history.length - 1; i >= until; --i) {
    const action = gameState.history[i];
    if (!action || deleted.has(action.id))
      continue;
    gameState.history.forEach((otherAction) => {
      if (otherAction.dependsOn === action.id && !deleted.has(otherAction.id))
        restructureHistory(otherAction.who, deleted, i);
    });
    if (action.who === id && !deleted.has(action.id)) {
      manageUndo(action, deleted);
      deleted.add(action.id);
    }
  }
}

export function addHistory(id: string, type: string, target: string, dice: number = -1, ability: string | null = null, dependency: string | null = null) {
  const who = id.startsWith("clone_") ? id.replace("clone_", "") : id;
  const isVoluntaryMov = type === "mov" && dice > 0;
  const aftermov = isVoluntaryMov ? false : gameState.history.some(
    (action) => action.who === who && action.type === "mov" && action.dice > 0);

  console.log("history: ", gameState.history);
  if (isVoluntaryMov && gameState.history.some((action) =>
    action.who === who && action.type === "mov")) {
    const deleted = new Set<string>()
    restructureHistory(who, deleted);
    gameState.history = gameState.history.filter((action) => !deleted.has(action.id));
  }
  if (type === 'ability') {
    const ent = gameState.players[id] || gameState.clones[id];
    ent.abilitiesCD[ability] = getAbility(ability)?.cd;
  }
  // const deleted = new Set<string>()
  // restructureHistory(who, deleted);
  // gameState.history = gameState.history.filter((action) => !deleted.has(action.id));
  const actionNumber = gameState.history.reduce((count, action) => {
    return action.who === who ? count + 1 : count
  }, 1);
  const newAction = {
    id: `${who}_${actionNumber}`,
    who: who,
    type: type,
    target: target,
    dice: dice,
    aftermov: aftermov,
    abName: ability,
    dependsOn: dependency,
  };
  gameState.history.push(newAction);
  console.log("new history: ", gameState.history);
}

export function moveClone(id: string, tileId: string, dice: number) {
  const [x, y, z] = tileId.split(',').map(Number);
  const dest = { x, y: y + 1, z };
  const cloneId = `clone_${id}`;
  const source = gameState.players[id] || gameState.clones[`clone_${id}`];
  if (!source)
    return;
  addHistory(id, "mov", tileId, dice);
  if (gameState.players[id]) {
    gameState.ghosts[id] = { ...gameState.players[id] };
    delete gameState.players[id];
  }
  gameState.clones[cloneId] = {
    ...source,
    id: cloneId,
    type: 'clone',
    dice: dice > 0 ? source.dice.toSpliced(source.dice.indexOf(
      dice), 1) : [...source.dice],
    usedDice: dice > 0 ? [...source.usedDice, dice].sort(
      (a, b) => a - b) : [...source.usedDice],
    abilitiesCD: { ...source.abilitiesCD },
    hasMoved: dice > 0 ? true : source.hasMoved,
    position: dest,
  };
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
  const base = () => ({
    usedDice: [],
    status: null,
    statusTurns: 0,
    hasMoved: false,
    facing: 'center',
    isDead: false,
    abilitiesCD: {},
  })
  entities.forEach((entity) => {
    switch (entity.type) {
      case "assassin":
        playEnt[entity.id] = {
          ...base(), ...entity, type: "player", hp: 13, maxHp: 13, armor: 0,
          abilities: ["Stab", "Dagger Throw", "Kick", "Restrain"],
          dice: [4, 4, 4, 4, 8],
        }
        break;
      case "paladin":
        playEnt[entity.id] = {
          ...base(), ...entity, type: "player", hp: 16, maxHp: 16, armor: 0,
          abilities: ["Thrust", "Defend", "Shield Bash", "Vertical Slash"],
          dice: [6, 6, 6, 6],
        }
        break;
      case "mage":
        playEnt[entity.id] = {
          ...base(), ...entity, type: "player", hp: 8, maxHp: 8, armor: 0,
          abilities: ["Fire Breath", "Azure Comet", "Small Meteor", "Rising Thorns"],
          dice: [4, 8, 12],
        }
        break;
      case "alchemist":
        playEnt[entity.id] = {
          ...base(), ...entity, type: "player", hp: 10, maxHp: 10, armor: 0,
          abilities: ["Stimulant", "Vacuum Flask", "Bombastic Flask", "Oxidation"],
          dice: [6, 8, 10],
        }
        break;
      case "drone":
        enemEnt[entity.id] = {
          ...base(), ...entity, type: "enemy", hp: 3, maxHp: 3, armor: 0,
          abilities: ["Swoop"],
          dice: [4, 4, 4],
        }
        break;
      case "crawler":
        enemEnt[entity.id] = {
          ...base(), ...entity, type: "enemy", hp: 4, maxHp: 4, armor: 0,
          abilities: ["Claw"],
          dice: [4, 4, 6],
        }
        break;
      case "spawner":
        enemEnt[entity.id] = {
          ...base(), ...entity, type: "enemy", hp: 10, maxHp: 10, armor: 0,
          abilities: ["Spawn Drone", "Spawn Crawler"],
          dice: [4, 6],
        }
        break;
      case "mortar":
        enemEnt[entity.id] = {
          ...base(), ...entity, type: "enemy", hp: 12, maxHp: 12, armor: 0,
          abilities: ["Shoot", "Reload"],
          dice: [6, 6],
        }
        break;
      case "centurion":
        enemEnt[entity.id] = {
          ...base(), ...entity, type: "enemy", hp: 20, maxHp: 20, armor: 2,
          abilities: ["Charge", "Atomic Bomb"],
          dice: [6, 8, 8],
        }
        break;
      case "jaeger":
        enemEnt[entity.id] = {
          ...base(), ...entity, type: "enemy", hp: 10, maxHp: 10, armor: 1,
          abilities: ["Push", "Railgun"],
          dice: [6, 6, 10],
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

function verticalTargets(tileid: string) {
  const [tx, ty, tz] = tileid.split(",").map(Number);
  const targets = [];
  const vertical = [[0, 0, 0], [0, 1, 0], [0, -1, 0]];
  for (const [dx, dy, dz] of vertical) {
    const x = tx + dx;
    const y = ty + dy;
    const z = tz + dz;
    if (isOOB(x, y, z))
      continue;
    const entid = checkEnt(x, y, z)?.id;
    if (entid)
      targets.push(entid);
  }
  return (targets);
}

function circleTargets(range: number, tileid: string) {
  const targets = [];
  const [tx, ty, tz] = tileid.split(",").map(Number);
  const pos = { x: tx, y: ty, z: tz };
  for (let dx = -range; dx <= range; ++dx) {
    for (let dz = -range; dz <= range; ++dz) {
      const x = pos.x + dx;
      const y = pos.y;
      const z = pos.z + dz;
      if (!isValid(x, y, z) || gameState.tiles[`${x},${y},${z}`]
        || (range * range < dx * dx + dz * dz))
        continue;
      if (hasLoS(pos, x, y, z) === 0) {
        const entid = checkEnt(x, y, z)?.id;
        if (entid)
          targets.push(entid);
        continue;
      }
    }
  }
  return (targets);
}

function coneTargets(id: string, tileid: string) {
  const o = gameState.players[id].position;
  const [tx, ty, tz] = tileid.split(",").map(Number);
  const [fx, fz] = [Math.sign(tx - o.x), Math.sign(tz - o.z)];
  const [px, pz] = [fz, fx];
  const targets = [];
  const cone = [
    [1, 0, 0], [2, 0, 0], [2, 1, 0], [2, -1, 0], [2, 0, -1],
    [2, 0, 1], [3, 0, 0], [3, 1, 0], [3, -1, 0], [3, 0, 1],
    [3, 1, 1], [3, -1, 1], [3, 0, -1], [3, 1, -1], [3, -1, -1],
  ];
  for (const [fwd, hgt, prp] of cone) {
    const x = o.x + fx * fwd + px * prp;
    const y = o.y + hgt;
    const z = o.z + fz * fwd + pz * prp;
    if (isOOB(x, y, z))
      continue;
    if (hasLoS(o, x, y, z) === 0) {
      const entid = checkEnt(x, y, z)?.id;
      if (entid)
        targets.push(entid);
    }
  }
  return (targets);
}

function getAoE(who: string, tileid: string, type: string, range: number) {
  let targets: string[] = [];
  switch (type) {
    case 'circle':
      targets = circleTargets(range, tileid)
      break;
    case 'vertical':
      targets = verticalTargets(tileid)
      break;
    case 'cone':
      targets = coneTargets(who, tileid)
      break;
  }
  return (targets);
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
    case 'smcircle':
      valid = euclidTiles({ x: pos.x, y: gameState.mapBounds.height, z: pos.z }, range, false);
      break;
    case 'rtcircle':
      valid = euclidTiles({ x: pos.x, y: gameState.mapBounds.height, z: pos.z }, range, false);
      break;
    case 'sphere':
      valid = euclidTiles(pos, range, true);
      break;
    default:
      valid = {};
  }
  valid[gameState.clients[who].selectedEnt] = false
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
        type: "cross",
        effect: ["burn", "2"],
        cond: (x: number) => x > 3,
        range: 1,
        dmg: (res: number) => Math.floor(res / 3),
        cd: 2,
        AoE: "cone",
        AoErange: 3,
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

export function checkEntnc(id: string, x: number, y: number, z: number) {
  const baseId = id.replace("clone_", "");
  const cloneId = `clone_${baseId}`;

  return (
    Object.values(gameState.enemies).some(e =>
      e.position.x === x && e.position.y === y && e.position.z === z)
    || Object.values(gameState.players).some(p => p.id !== baseId
      && p.position.x === x && p.position.y === y && p.position.z === z)
    || Object.values(gameState.clones).some(c => c.id !== cloneId
      && c.position.x === x && c.position.y === y && c.position.z === z)
  );
}

export function checkEnt(x: number, y: number, z: number) {
  const finder = (e) => (
    e.position.x === x
    && e.position.y === y
    && e.position.z === z
  );
  return (
    Object.values(gameState.enemies).find(finder)
    || Object.values(gameState.players).find(finder)
    || Object.values(gameState.clones).find(finder)
  );
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

export function isBlockednc(id: string, x: number, y: number, z: number) {
  const key = `${x},${y},${z}`;
  return (gameState.tiles[key] || checkEntnc(id, x, y, z));
}

export function hasFloor(x: number, y: number, z: number) {
  return (y - 1 < 0 || (isBlocked(x, y - 1, z)
    && !checkEnt(x, y - 1, z)) ? true : false)
}

export function dijkstra(id: string, pos: pos, maxCost: number) {
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
      if (isOOB(nx, ny, nz) || isBlockednc(id, nx, ny, nz)
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
