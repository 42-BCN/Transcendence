import TinyQueue from 'tinyqueue';
import { testMap, parseMap } from './maps';
import type { vfx, pos, player, enemy, entity, serverGameState, node, historyAction, abilityInfo } from './types';

const STATUS_TYPE = 0;
const N_TURNS = 1;

let _historySeq = 0;
let _vfxSeq = 0;
export const nextVfxId = (label: string) => `${label}_${Date.now()}_${++_vfxSeq}`;

export const gameState: serverGameState = {
  phase: 'PLAN',
  turn: 1,
  doom: 0,
  players: {},
  ghosts: {},
  clones: {},
  enemies: {},
  tiles: {},
  clients: {},
  history: [],
  mapBounds: { width: 0, height: 0, depth: 0 },
  forcedMoveOrigins: {},
  planningStatusOrigins: {}
};

let stateQueue = Promise.resolve();

function applyState(target: serverGameState, source: serverGameState) {
  for (const key of Object.keys(target) as Array<keyof serverGameState>) {
    delete (target as Record<string, unknown>)[key];
  }
  Object.assign(target, source);
}

export async function runWithGameState<T>(state: serverGameState, operation: () => Promise<T> | T): Promise<T> {
  const run = async () => {
    applyState(gameState, state);
    try {
      return await operation();
    } finally {
      applyState(state, gameState);
    }
  };

  const result = stateQueue.then(run);
  stateQueue = result.then(() => undefined, () => undefined);
  return result;
}

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

export async function nextPhase(sync: () => void, vfx: (effect: vfx) => void) {
  if (gameState.phase !== 'PLAN')
    return console.log('nextPhase tried to execute with phase', gameState.phase);
  phaseClean();
  gameState.phase = 'EXEC';
  sync();
  try {
    await executionPhase(sync, vfx);
    if (gameState.phase === 'WIN' || gameState.phase === 'LOSE') {
      sync();
      return;
    }

    incrementDoom(vfx);
    if (gameState.phase === 'LOSE') {
      sync();
      return;
    }
    await enemyPhase(sync, vfx);
    if (gameState.phase === 'LOSE') {
      sync();
      return;
    }
    await endTurn(sync, vfx);
  } catch (err) {
    console.error('Turn resolution failed:', err);
    gameState.phase = 'PLAN';
    for (const id in gameState.clients)
      setClear(id);
  }
}

async function executeForcedMov(action: historyAction, vfx: (effect: vfx) => void, sync: () => void) {
  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  const ent: any = gameState.players[action.who] || gameState.enemies[action.who];
  if (!ent || ent.isDead)
    return;
  const [tx, ty, tz] = action.target.split(',').map(Number);
  const destPos = { x: tx, y: ty + 1, z: tz };
  const fromPos = { ...ent.position };
  if (fromPos.x === destPos.x && fromPos.y === destPos.y && fromPos.z === destPos.z)
    return;
  const destBlocked = isOOB(destPos.x, destPos.y, destPos.z) ||
    !!gameState.tiles[`${destPos.x},${destPos.y},${destPos.z}`] ||
    !!checkEntnc(action.who, destPos.x, destPos.y, destPos.z);
  if (destBlocked) {
    applyCollisionDamage(action.who, vfx);
    sync();
    await sleep(300);
    return;
  }
  if (destPos.y < fromPos.y) {
    const fallDmg = fromPos.y - destPos.y;
    ent.hp = Math.max(0, ent.hp - fallDmg);
    if (ent.hp === 0) killEntity(ent);
    vfx({
      vfxid: nextVfxId(`fall_${ent.id}`),
      eid: ent.id,
      type: 'damage',
      amount: fallDmg,
    });
  }
  ent.position = { ...destPos };
  sync();
  await sleep(300);
}

export async function executionPhase(sync: () => void, vfx: (effect: vfx) => void) {
  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  for (const entityId in gameState.forcedMoveOrigins) {
    const ent: any = gameState.players[entityId] ||
      gameState.enemies[entityId] || gameState.clones[entityId];
    if (ent) ent.position = { ...gameState.forcedMoveOrigins[entityId] };
  }
  for (const k in gameState.forcedMoveOrigins)
    delete (gameState.forcedMoveOrigins as Record<string, unknown>)[k];
  for (const entityId in gameState.planningStatusOrigins) {
    const ent: any =
      gameState.players[entityId] ||
      gameState.enemies[entityId] ||
      gameState.clones[`clone_${entityId}`];
    if (ent) {
      const origin = gameState.planningStatusOrigins[entityId];
      ent.status = origin.status;
      ent.statusTurns = origin.statusTurns;
      if (origin.dice !== undefined) {
        ent.dice = [...origin.dice];
        ent.usedDice = [...origin.usedDice!];
      }
    }
  }
  for (const k in gameState.planningStatusOrigins)
    delete (gameState.planningStatusOrigins as Record<string, unknown>)[k];
  for (const id in gameState.ghosts) {
    gameState.players[id] = {
      ...gameState.ghosts[id],
      abilitiesCD: {
        ...gameState.ghosts[id].abilitiesCD,
        ...(gameState.clones[`clone_${id}`]?.abilitiesCD ?? {}),
      },
    };
  }
  for (const k in gameState.ghosts)
    delete (gameState.ghosts as Record<string, unknown>)[k];
  for (const k in gameState.clones)
    delete (gameState.clones as Record<string, unknown>)[k];
  const historySnapshot = [...gameState.history];
  for (const action of historySnapshot) {
    if (action.type === 'ability' && action.abName) {
      executeAbility(action.who, action.abName, action.target, action.dice, vfx, action.id);
      sync();
      await sleep(400);
    }
    else if (action.type === 'mov') {
      sync();
      await moveTo(action.who, action.target, sync);
    }
    else if (action.type === 'forcedMov') {
      await executeForcedMov(action, vfx, sync);
    }
    if (Object.values(gameState.enemies).some(e => e.id === 'generator' && e.isDead)) {
      gameState.phase = 'WIN';
      return;
    }
  }
  phaseClean();
}

export function incrementDoom(vfx: (effect: vfx) => void) {
  for (const enemy of Object.values(gameState.enemies)) {
    if (enemy.isDead)
      continue;
    const name = enemy.id.split('_')[0];
    let doomAmt = 0;
    if (name === 'crawler' || name === 'drone')
      doomAmt = 1;
    else if (name === 'jaeger' || name === 'centurion')
      doomAmt = 3;
    else if (name === 'generator')
      doomAmt = 5;
    if (doomAmt === 0)
      continue;
    const capped = gameState.doom + doomAmt > 100 ? 100 - gameState.doom : doomAmt;
    vfx({
      vfxid: nextVfxId(`doom_${enemy.id}`),
      eid: enemy.id,
      type: 'doom',
      amount: capped,
    });
    gameState.doom = gameState.doom + capped;
    if (gameState.doom === 100) {
      gameState.phase = 'LOSE';
      return;
    }
  }
}

function canEnemyAttackTarget(
  fromPos: pos,
  target: entity,
  ab: abilityInfo,
): boolean {
  if (!ab || ab.name === 'error' || ab.range === 0) return false;
  const tp = target.position;
  const dx = tp.x - fromPos.x;
  const dz = tp.z - fromPos.z;

  switch (ab.type) {
    case 'cross': {
      if (tp.y !== fromPos.y || (dx !== 0 && dz !== 0)) return false;
      const dist = Math.abs(dx) + Math.abs(dz);
      if (dist === 0 || dist > ab.range) return false;
      const sx = Math.sign(dx), sz = Math.sign(dz);
      for (let n = 1; n < dist; n++) {
        const cx = fromPos.x + n * sx, cz = fromPos.z + n * sz;
        if (gameState.tiles[`${cx},${fromPos.y},${cz}`]) return false;
        const blocker = checkEnt(cx, fromPos.y, cz);
        if (blocker && !blocker.isDead) return false;
      }
      return true;
    }
    case 'circle': {
      if (tp.y !== fromPos.y) return false;
      const d2 = Math.sqrt(dx * dx + dz * dz);
      if (d2 === 0 || d2 > ab.range) return false;
      return hasLoS(fromPos, tp.x, tp.y, tp.z) !== -1;
    }
    case 'sphere': {
      const dy = tp.y - fromPos.y;
      const d3 = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d3 === 0 || d3 > ab.range) return false;
      return hasLoS(fromPos, tp.x, tp.y, tp.z) !== -1;
    }
    default:
      return false;
  }
}

function findBestEnemyAttackPos(
  enemy: entity,
  target: entity,
  ab: abilityInfo,
  maxMoveRange: number,
): pos | null {
  if (!ab || ab.name === 'error' || ab.range === 0)
    return null;
  const reachable = dijkstra(enemy.id, enemy.position, maxMoveRange);
  reachable.push(`${enemy.position.x},${enemy.position.y - 1},${enemy.position.z}`);

  let bestPos: pos | null = null;
  let bestDist = -1;
  for (const tileId of reachable) {
    const [tx, ty, tz] = tileId.split(',').map(Number);
    const cPos: pos = { x: tx, y: ty + 1, z: tz };
    if (!canEnemyAttackTarget(cPos, target, ab))
      continue;
    const dx = cPos.x - target.position.x;
    const dz = cPos.z - target.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > bestDist) { bestDist = dist; bestPos = cPos; }
  }
  return bestPos;
}

export async function enemyPhase(sync: () => void, vfx: (effect: vfx) => void) {
  gameState.phase = 'ENEMY';
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  sync();
  await sleep(1000);

  for (const enemy of Object.values(gameState.enemies)) {
    if (enemy.isDead || !enemy.abilities?.length || !enemy.dice?.length)
      continue;

    if (enemy.status === 'restrain' && enemy.dice.length > 0) {
      enemy.usedDice.push(enemy.dice[0]);
      enemy.dice.splice(0, 1);
    }
    if (!enemy.dice.length)
      continue;

    let closestDist = Infinity;
    let closestPath: string[] = [];
    let targetId: string | null = null;

    for (const player of Object.values(gameState.players)) {
      if (player.isDead)
        continue;
      const p = Astar(enemy.position, player.position, true);
      if (!p || p.length === 0)
        continue;
      const d = p.length - 1;
      if (d < closestDist) { closestDist = d; closestPath = p; targetId = player.id; }
    }
    if (!targetId || closestPath.length === 0)
      continue;
    const target = gameState.players[targetId];
    if (!target)
      continue;
    const validAbs = enemy.abilities
      .map((name: string) => ({ name, ab: getAbility(name) }))
      .filter(({ ab }: { name: string; ab: abilityInfo }) => ab.name !== 'error' && ab.range > 0)
      .sort((a: { name: string; ab: abilityInfo }, b: { name: string; ab: abilityInfo }) =>
        (b.ab.range + (b.ab.AoErange ?? 0)) -
        (a.ab.range + (a.ab.AoErange ?? 0))
      );
    if (!validAbs.length)
      continue;
    const { name: chosenName, ab: chosenAb } = validAbs[0];
    enemy.dice.sort((a, b) => a - b);
    if (canEnemyAttackTarget(enemy.position, target, chosenAb)) {
      const attackDie = enemy.dice.pop()!;
      enemy.usedDice.push(attackDie);
      executeAbility(enemy.id, chosenName, targetId, attackDie, vfx);
      sync();
      await sleep(400);
      continue;
    }
    const maxMoveDie = enemy.dice[enemy.dice.length - 1];
    const bestAtkPos = findBestEnemyAttackPos(enemy, target, chosenAb, maxMoveDie);

    const samePos = (a: pos, b: pos) =>
      a.x === b.x && a.y === b.y && a.z === b.z;

    let movePath: string[];
    let moveDie: number;

    if (bestAtkPos && !samePos(bestAtkPos, enemy.position)) {
      const atkPath = Astar(enemy.position, bestAtkPos) ?? [];
      const stepsNeeded = Math.max(atkPath.length - 1, 0);
      const minIdx = enemy.dice.findIndex((d) => d >= stepsNeeded);
      moveDie = minIdx !== -1 ? enemy.dice.splice(minIdx, 1)[0] : enemy.dice.pop()!;
      movePath = atkPath.length > 1 ? atkPath : closestPath.slice(0, -1);
    }
    else {
      const stepsToAdj = Math.max(closestDist - 1, 0);
      const minIdx = enemy.dice.findIndex((d) => d >= stepsToAdj);
      moveDie = minIdx !== -1 ? enemy.dice.splice(minIdx, 1)[0] : enemy.dice.pop()!;
      movePath = closestPath.slice(0, -1); // exclude player tile
    }
    enemy.usedDice.push(moveDie);
    const steps = Math.min(movePath.length - 1, moveDie);
    for (let i = 1; i <= steps; i++) {
      await sleep(300);
      const [sx, sy, sz] = movePath[i].split(',').map(Number);
      gameState.enemies[enemy.id].position = { x: sx, y: sy, z: sz };
      sync();
    }
    if (!enemy.dice.length)
      continue;
    const movedEnt = gameState.enemies[enemy.id];
    if (!movedEnt || movedEnt.isDead)
      continue;
    if (canEnemyAttackTarget(movedEnt.position, target, chosenAb)) {
      const attackDie = enemy.dice.pop()!;
      enemy.usedDice.push(attackDie);
      executeAbility(enemy.id, chosenName, targetId, attackDie, vfx);
      sync();
      await sleep(400);
    }
  }
  phaseClean();
  let isOver = true;
  for (const ent of Object.values(gameState.players)) {
    if (!ent.isDead)
      isOver = false;
  }
  if (isOver === true)
    gameState.phase = 'LOSE';
}

export async function endTurn(sync: () => void, vfx: (effect: vfx) => void) {
  gameState.phase = 'END';
  sync();
  const entities = { ...gameState.players, ...gameState.enemies }
  for (const ent of Object.values(entities)) {
    if (!ent)
      continue;
    if (ent.isDead) {
      if (ent.type === 'player')
        delete gameState.players[ent.id];
      else if (ent.type === 'enemy')
        delete gameState.enemies[ent.id];
      continue;
    }
    updateCooldowns(ent.id);
    const status = ent.status;
    if (status) {
      if (status === 'burn') {
        vfx({ vfxid: nextVfxId(`burn_proc_${ent.id}`), eid: ent.id, type: 'damage', amount: ent.statusTurns });
        if ((ent.hp -= ent.statusTurns) <= 0) {
          ent.hp = 0;
          ent.isDead = true;
        }
      }
      if (!ent.isDead && (ent.status === 'boost' || --ent.statusTurns === 0)) {
        ent.status = null;
        ent.statusTurns = 0;
        vfx({ vfxid: nextVfxId(`stat_expire_${ent.id}`), eid: ent.id, type: 'stat expire', amount: null });
      }
    }
    if (ent.isDead) {
      if (ent.type === 'player')
        delete gameState.players[ent.id];
      else if (ent.type === 'enemy')
        delete gameState.enemies[ent.id];
    }
    else {
      ent.dice = [...ent.dice, ...ent.usedDice].sort((a, b) => a - b);
      ent.usedDice = [];
      ent.hasMoved = false;
    }
  };
  if (gameState.phase !== 'WIN' && gameState.phase !== 'LOSE') {
    gameState.turn = gameState.turn + 1;
    gameState.phase = 'PLAN';
    gameState.history.splice(0);
    for (const k in gameState.clones)
      delete (gameState.clones as Record<string, unknown>)[k];
    for (const k in gameState.forcedMoveOrigins)
      delete (gameState.forcedMoveOrigins as Record<string, unknown>)[k];
    for (const k in gameState.planningStatusOrigins)
      delete (gameState.planningStatusOrigins as Record<string, unknown>)[k];
  }
  sync();
  for (const id in gameState.clients)
    setClear(id);
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
  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
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

export function addDisplaceHistory(
  cause: string,
  id: string,
  origin: string,
  pos: pos,
  many: number
): void {
  const [ox, , oz] = origin.split(',').map(Number);
  const dx = Math.sign(pos.x - ox);
  const dz = Math.sign(pos.z - oz);
  if (dx === 0 && dz === 0)
    return;
  for (let step = 0; step < many; step++) {
    const chain: string[] = [];
    let cursor = id;
    while (true) {
      const ent =
        gameState.players[cursor] ??
        gameState.clones[`clone_${cursor}`] ??
        gameState.enemies[cursor];
      if (!ent || ent.isDead)
        break;
      chain.push(cursor);
      const nx = ent.position.x + dx;
      const nz = ent.position.z + dz;
      const nextEnt = checkEnt(nx, ent.position.y, nz);
      if (nextEnt && !nextEnt.isDead)
        cursor = nextEnt.id.replace('clone_', '');
      else
        break;
    }
    if (chain.length === 0)
      return;
    const lastId = chain[chain.length - 1];
    const lastEnt = gameState.players[lastId] ??
      gameState.clones[`clone_${lastId}`] ??
      gameState.enemies[lastId];
    if (!lastEnt)
      return;
    const endX = lastEnt.position.x + dx;
    const endY = lastEnt.position.y;
    const endZ = lastEnt.position.z + dz;
    if (isOOB(endX, endY, endZ) || !!gameState.tiles[`${endX},${endY},${endZ}`])
      return;
    for (let i = chain.length - 1; i >= 0; i--) {
      const eid = chain[i];
      const ent =
        gameState.players[eid] ??
        gameState.clones[`clone_${eid}`] ??
        gameState.enemies[eid];
      if (!ent)
        continue;
      const tx = ent.position.x + dx;
      let ty = ent.position.y;
      const tz = ent.position.z + dz;
      if (!hasFloor(tx, ty, tz)) {
        let fallY = ty - 1;
        while (fallY > 0 && !hasFloor(tx, fallY, tz)) fallY--;
        if (fallY < 0)
          return;
        ty = fallY;
      }
      moveClone(eid, `${tx},${ty - 1},${tz}`, 0, cause);
    }
  }
}

function getLiveEnt(id: string) {
  return (
    gameState.players[id]
    ?? gameState.enemies[id]
    ?? gameState.clones[id]
    ?? gameState.clones[`clone_${id}`]
  );
}

function killEntity(ent: any) {
  ent.usedDice = [...ent.dice, ...ent.usedDice];
  ent.dice = [];
  ent.isDead = true;
}

function applyCollisionDamage(id: string, vfx: (effect: vfx) => void) {
  const ent: any = getLiveEnt(id);
  if (!ent || ent.isDead) return;

  ent.hp = Math.max(0, ent.hp - 1);
  if (ent.hp === 0) {
    killEntity(ent);
  }
  vfx({
    vfxid: nextVfxId(`col_${id}`),
    eid: id,
    type: 'damage',
    amount: 1,
  });
}

function getDisplaceDir(attackerPos: pos, targetPos: pos, direction: 'away' | 'towards') {
  const rawDx = Math.sign(targetPos.x - attackerPos.x);
  const rawDz = Math.sign(targetPos.z - attackerPos.z);
  return direction === 'towards'
    ? { dx: -rawDx, dz: -rawDz }
    : { dx: rawDx, dz: rawDz };
}

export function resolveDisplace(id: string, dx: number, dz: number, steps: number, vfx: (effect: vfx) => void, cause: string | null = null) {
  for (let step = 0; step < steps; step++) {
    const chain: string[] = [];
    let cursor = id;
    while (true) {
      const ent: any = getLiveEnt(cursor);
      if (!ent || ent.isDead)
        break;
      chain.push(cursor);
      const nx = ent.position.x + dx;
      const ny = ent.position.y;
      const nz = ent.position.z + dz;
      const nextEnt: any = checkEnt(nx, ny, nz);
      if (nextEnt && !nextEnt.isDead) cursor = nextEnt.id;
      else
        break;
    }
    if (chain.length === 0)
      return;
    const lastEnt: any = getLiveEnt(chain[chain.length - 1]);
    if (!lastEnt)
      return;
    const endX = lastEnt.position.x + dx;
    const endY = lastEnt.position.y;
    const endZ = lastEnt.position.z + dz;
    const wallAhead = isOOB(endX, endY, endZ) ||
      !!gameState.tiles[`${endX},${endY},${endZ}`] ||
      !!checkEnt(endX, endY, endZ);
    if (wallAhead) {
      chain.forEach((eid) => applyCollisionDamage(eid, vfx));
      return;
    }
    for (let i = chain.length - 1; i >= 0; i--) {
      const eid = chain[i];
      const ent: any = getLiveEnt(eid);
      if (!ent)
        continue;
      const tx = ent.position.x + dx;
      let ty = ent.position.y;
      const tz = ent.position.z + dz;
      if (!hasFloor(tx, ty, tz)) {
        let fallY = ty - 1;
        while (fallY > 0 && !hasFloor(tx, fallY, tz)) fallY--;
        const fallDmg = ty - fallY;
        ty = fallY;
        if (fallDmg > 0) {
          ent.hp = Math.max(0, ent.hp - fallDmg);
          if (ent.hp === 0) {
            killEntity(ent);
          }
          vfx({
            vfxid: nextVfxId(`fall_${eid}`),
            eid,
            type: 'damage',
            amount: fallDmg,
          });
        }
      }
      addHistory(eid, 'mov', `${tx},${ty - 1},${tz}`, 0, null, cause);
      ent.position = { x: tx, y: ty, z: tz };
    }
  }
}

function calcPlanningDisplace(actioner: string, targetId: string, ab: abilityInfo, centerPos?: pos) {
  if (!ab.effect || ab.effect[0] !== 'move')
    return null;
  const direction = ab.effect[1] as 'away' | 'towards';
  const steps = ab.effect[2] ? Number(ab.effect[2]) : 1;
  const originPos: pos | undefined = centerPos ?? (getLiveEnt(actioner) as any)?.position;
  const target: any = getLiveEnt(targetId);
  if (!originPos || !target || target.isDead)
    return null;
  const { dx, dz } = getDisplaceDir(originPos, target.position, direction);
  if (dx === 0 && dz === 0)
    return null;
  let x = target.position.x;
  let y = target.position.y;
  let z = target.position.z;
  for (let step = 0; step < steps; step++) {
    const nx = x + dx;
    const nz = z + dz;
    if (isOOB(nx, y, nz) || !!gameState.tiles[`${nx},${y},${nz}`])
      break;
    if (checkEntnc(targetId, nx, y, nz))
      break;
    let ny = y;
    if (!hasFloor(nx, ny, nz)) {
      let fallY = ny - 1;
      while (fallY > 0 && !hasFloor(nx, fallY, nz)) fallY--;
      ny = fallY;
    }
    x = nx; y = ny; z = nz;
  }
  return { x, y, z };
}
export function applyPlanningDisplace(actioner: string, targetId: string, ab: abilityInfo, abilityActionId: string, centerPos?: pos) {
  let resolvedId = targetId;
  if (targetId.includes(',')) {
    const [tx, ty, tz] = targetId.split(',').map(Number);
    const entOnTile = checkEnt(tx, ty + 1, tz);
    if (!entOnTile || entOnTile.isDead) return;
    resolvedId = entOnTile.id;
  }
  const newPos = calcPlanningDisplace(actioner, resolvedId, ab, centerPos);
  if (!newPos)
    return;
  const entObj: any = gameState.players[resolvedId] || gameState.enemies[resolvedId] ||
    gameState.clones[resolvedId] || gameState.clones[`clone_${resolvedId}`];
  if (!entObj)
    return;
  if (newPos.x === entObj.position.x &&
    newPos.y === entObj.position.y &&
    newPos.z === entObj.position.z)
    return;
  const actualId: string = entObj.id;
  if (!gameState.forcedMoveOrigins[actualId]) {
    gameState.forcedMoveOrigins[actualId] = { ...entObj.position };
  }
  entObj.position = { ...newPos };
  const who = resolvedId.startsWith("clone_") ? resolvedId.replace("clone_", "") : resolvedId;
  addHistory(who, "forcedMov", `${newPos.x},${newPos.y - 1},${newPos.z}`, 0, null, abilityActionId);
}

export function applyPlanningStatus(actioner: string, targetId: string, ab: abilityInfo, abilityActionId: string) {
  if (!ab.effect || !ab.effect[0] || ab.effect[0] === 'move')
    return;
  let targets: string[] = [];
  if (!targetId.includes(',')) {
    targets = [targetId];
  }
  else {
    const [x, y, z] = targetId.split(',').map(Number);
    const entOnTile = checkEnt(x, y + 1, z);
    if (entOnTile && !entOnTile.isDead) targets = [entOnTile.id];
  }
  if (ab.AoE) {
    targets = [...new Set([...targets, ...getAoE(actioner, targetId, ab.AoE, ab.AoErange)])];
  }
  for (const tid of targets) {
    const ent: any = getLiveEnt(tid);
    if (!ent || ent.isDead)
      continue;
    const entityKey = tid.startsWith('clone_') ? tid.replace('clone_', '') : tid;
    if (gameState.planningStatusOrigins[entityKey] === undefined) {
      gameState.planningStatusOrigins[entityKey] = {
        status: ent.status,
        statusTurns: ent.statusTurns,
        dice: [...ent.dice],
        usedDice: [...ent.usedDice],
      };
    }
    ent.status = ab.effect[0];
    ent.statusTurns = Number(ab.effect[1] ?? 0);
    if (ab.effect[0] === 'restrain' && ent.dice.length > 0) {
      const removed = ent.dice[0];
      ent.dice = ent.dice.slice(1);
      ent.usedDice = [...ent.usedDice, removed].sort((a: number, b: number) => a - b);
    }
    addHistory(entityKey, 'planningStatus', '', 0, ab.effect[0], abilityActionId);
  }
}

export function applyDisplace(actioner: string, targetId: string, ab: abilityInfo, cause: string | null, vfx: (effect: vfx) => void) {
  if (!ab.effect || ab.effect[0] !== 'move')
    return;
  const direction = ab.effect[1] as 'away' | 'towards';
  const steps = ab.effect[2] ? Number(ab.effect[2]) : 1;
  const attacker: any = getLiveEnt(actioner);
  const target: any = getLiveEnt(targetId);
  if (!attacker || !target || target.isDead)
    return;
  const { dx, dz } = getDisplaceDir(attacker.position, target.position, direction);
  if (dx === 0 && dz === 0)
    return;
  resolveDisplace(targetId, dx, dz, steps, vfx, cause);
}

export function manageUndo(action: historyAction, deleted: Set<string>) {
  const who = action.who;
  switch (action.type) {
    case "mov": {
      if (action.dice === 0) {
        const prev = gameState.history.findLast((a: historyAction) => a.who === who
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
    case "forcedMov": {
      const ent: any =
        gameState.players[who] ||
        gameState.clones[`clone_${who}`] ||
        gameState.enemies[who];
      if (!ent)
        break;
      const origin = gameState.forcedMoveOrigins[ent.id];
      if (!origin)
        break;
      ent.position = { ...origin };
      delete gameState.forcedMoveOrigins[ent.id];
      break;
    }
    case "planningStatus": {
      const ent =
        gameState.players[who] ||
        gameState.enemies[who] ||
        gameState.clones[`clone_${who}`];
      if (!ent) break;
      const origin = gameState.planningStatusOrigins[who];
      if (origin !== undefined) {
        ent.status = origin.status;
        ent.statusTurns = origin.statusTurns;
        if (origin.dice !== undefined) {
          (ent as any).dice = [...origin.dice];
          (ent as any).usedDice = [...origin.usedDice!];
        }
        delete gameState.planningStatusOrigins[who];
      }
      break;
    }
  }
}

export function calcDmg(actioner: string, id: string, ab: abilityInfo, roll: number) {
  const target = gameState.enemies[id] || gameState.players[id];
  const attacker = gameState.enemies[actioner] || gameState.players[actioner];
  if (!target || !attacker)
    return console.log('target not found in calcDmg');
  // INFO: base
  let dmg = (typeof ab.dmg === 'function' ? ab.dmg(roll) : ab.dmg);
  if (attacker.status === 'boost') {
    dmg += Math.ceil(Math.random() * attacker.statusTurns);
    attacker.status = null;
    attacker.statusTurns = 0;
  }
  const trueArmor = target.armor
    - (target.status === 'oxidation' ? target.statusTurns : 0)
    + (target.status === 'shield' ? target.statusTurns : 0);
  dmg = Math.max(dmg - trueArmor, 0);
  target.hp -= dmg;
  if (target.hp <= 0) {
    dmg += target.hp;
    target.hp = 0;
    target.usedDice = [...target.dice, ...target.usedDice];
    target.dice = [];
    target.isDead = true;
  }
  return dmg;
}

export function takeAb(actioner: string, id: string, ab: abilityInfo, roll: number, vfx: (effect: vfx) => void, cause: string | null = null) {
  const target = gameState.enemies[id] || gameState.players[id];
  if (!target)
    return console.log('target not found in takeAb');
  const eff: any = {
    vfxid: nextVfxId(`damage_${id}`),
    eid: id,
    type: 'damage',
    amount: null
  };
  eff.amount = calcDmg(actioner, id, ab, roll) ?? 0;
  vfx(eff);
  if (ab.effect && ab.effect[STATUS_TYPE] === 'move' && !target.isDead) {
    if (gameState.phase !== 'EXEC') {
      applyDisplace(actioner, id, ab, cause, vfx);
    }
    return;
  }
  const hadStatus = Boolean(target.status);
  if (ab.effect && ab.effect[STATUS_TYPE] && (!target.status || ab.effect[STATUS_TYPE] === target.status)) {
    target.status = ab.effect[STATUS_TYPE];
    vfx({ vfxid: nextVfxId(`status_${id}`), eid: id, type: target.status, amount: null });
    if (target.status !== 'push' && !hadStatus) {
      target.statusTurns += Number(ab.effect[N_TURNS]);
    }
  }
}

export function restructureHistory(id: string, deleted: Set<string>, until: number = -1, isCascade: boolean = false) {
  if (until === -1)
    until = gameState.history.findIndex((action: historyAction) => action.who === id);
  if (until === -1)
    return (console.log("restructure history didn't finish"));
  for (let i = gameState.history.length - 1; i >= until; --i) {
    const action = gameState.history[i];
    if (!action || deleted.has(action.id))
      continue;
    gameState.history.forEach((otherAction) => {
      if (otherAction.dependsOn === action.id && !deleted.has(otherAction.id))
        restructureHistory(otherAction.who, deleted, i, true);
    });
    if (action.who === id && !deleted.has(action.id)) {
      if (!isCascade && (action.type === 'forcedMov' || action.type === 'planningStatus'))
        continue;
      manageUndo(action, deleted);
      deleted.add(action.id);
    }
  }
}

export function addHistory(id: string, type: string, target: string, dice: number = -1, ability: string | null = null, dependency: string | null = null,) {
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
    if (!ent) {
      console.log('no ent in addHistory!');
      return undefined;
    }
    if (ability) ent.abilitiesCD[ability] = getAbility(ability)?.cd;
  }
  const newAction = {
    id: `${who}_${++_historySeq}`,
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
  return newAction.id;
}

export function moveClone(id: string, tileId: string, dice: number, cause: string | null = null) {
  const [x, y, z] = tileId.split(',').map(Number);
  const dest = { x, y: y + 1, z };
  const cloneId = `clone_${id}`;
  const source = gameState.players[id] || gameState.clones[`clone_${id}`] || gameState.enemies[id];
  if (!source)
    return;
  addHistory(id, "mov", tileId, dice, null, cause);
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
      case "generator":
        enemEnt[entity.id] = {
          ...base(), ...entity, type: "enemy", hp: 50, maxHp: 50, armor: 0,
          abilities: [],
          dice: [],
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
        if (
          !isValid(x, y, z) ||
          gameState.tiles[`${x},${y},${z}`] ||
          range * range < dx * dx + dy * dy + dz * dz
        )
          continue;
        const resLoS = hasLoS(pos, x, y, z);
        if (resLoS === -1)
          continue;
        if (resLoS === 0) {
          const ent = checkEnt(x, y, z);
          if (ent) {
            valid[ent.id] = true;
            const floorKey = `${x},${y - 1},${z}`;
            if (gameState.tiles[floorKey]) valid[floorKey] = true;
          }
          continue;
        }
        valid[`${x},${y - 1},${z}`] = true;
      }
    }
  }
  return valid;
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
      if (!isValid(x, y, z) || gameState.tiles[`${x},${y},${z}`]) break;
      const ent = checkEnt(x, y, z);
      if (ent) {
        valid[ent.id] = true;
        const floorKey = `${x},${y - 1},${z}`;
        if (gameState.tiles[floorKey]) valid[floorKey] = true;
        break;
      }
      valid[`${x},${y - 1},${z}`] = true;
    }
  }
  return valid;
}

function circleTargets(range: number, tileid: string): string[] {
  let cx: number, cy: number, cz: number;
  if (tileid.includes(',')) {
    const [tx, ty, tz] = tileid.split(',').map(Number);
    cx = tx; cy = ty + 1; cz = tz;
  } else {
    const ent = getLiveEnt(tileid);
    if (!ent)
      return [];
    ({ x: cx, y: cy, z: cz } = ent.position);
  }

  const centre = { x: cx, y: cy, z: cz };
  const targets: string[] = [];

  for (let dx = -range; dx <= range; ++dx) {
    for (let dz = -range; dz <= range; ++dz) {
      if (range * range < dx * dx + dz * dz)
        continue;
      const x = cx + dx;
      const z = cz + dz;
      if (!isValid(x, cy, z) || gameState.tiles[`${x},${cy},${z}`])
        continue;
      const los = hasLoS(centre, x, cy, z);
      if (los === 0) {
        const entid = checkEnt(x, cy, z)?.id;
        if (entid) targets.push(entid);
      }
    }
  }
  return targets;
}

function verticalTargets(tileid: string): string[] {
  let cx: number, cy: number, cz: number;
  if (tileid.includes(',')) {
    const [tx, ty, tz] = tileid.split(',').map(Number);
    cx = tx; cy = ty + 1; cz = tz;
  } else {
    const ent = getLiveEnt(tileid);
    if (!ent)
      return [];
    ({ x: cx, y: cy, z: cz } = ent.position);
  }
  const targets: string[] = [];
  for (const [dx, dy, dz] of [[0, 0, 0], [0, 1, 0], [0, -1, 0]] as const) {
    const x = cx + dx, y = cy + dy, z = cz + dz;
    if (isOOB(x, y, z)) continue;
    const entid = checkEnt(x, y, z)?.id;
    if (entid) targets.push(entid);
  }
  return targets;
}

function coneTargets(id: string, tileid: string): string[] {
  const attacker =
    gameState.players[id] ||
    gameState.clones[id] ||
    gameState.clones[`clone_${id}`];
  if (!attacker)
    return [];
  const o = attacker.position;
  let tx: number, ty: number, tz: number;
  if (tileid.includes(',')) {
    [tx, ty, tz] = tileid.split(',').map(Number);
    ty = ty + 1;
  } else {
    const ent = getLiveEnt(tileid);
    if (!ent)
      return [];
    ({ x: tx, y: ty, z: tz } = ent.position);
  }
  const [fx, fz] = [Math.sign(tx - o.x), Math.sign(tz - o.z)];
  const [px, pz] = [fz, fx];
  const targets: string[] = [];
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
      if (entid) targets.push(entid);
    }
  }
  return targets;
}

function crossAoETargets(range: number, tileid: string): string[] {
  let cx: number, cy: number, cz: number;
  if (tileid.includes(',')) {
    const [tx, ty, tz] = tileid.split(',').map(Number);
    cx = tx; cy = ty + 1; cz = tz;
  } else {
    const ent = getLiveEnt(tileid);
    if (!ent) return [];
    ({ x: cx, y: cy, z: cz } = ent.position);
  }
  const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]] as const;
  const targets: string[] = [];
  for (const [dx, , dz] of DIRS) {
    for (let n = 1; n <= range; ++n) {
      const x = cx + n * dx;
      const z = cz + n * dz;
      if (!isValid(x, cy, z) || gameState.tiles[`${x},${cy},${z}`]) break;
      const ent = checkEnt(x, cy, z);
      if (ent && !ent.isDead) targets.push(ent.id);
    }
  }
  return targets;
}

export function getAoE(who: string, tileid: string, type: string, range: number | undefined) {
  switch (type) {
    case 'circle': return circleTargets(range ?? 1, tileid);
    case 'vertical': return verticalTargets(tileid);
    case 'cone': return coneTargets(who, tileid);
    case 'cross': return crossAoETargets(range ?? 1, tileid);
    default: return [];
  }
}

export function executeAbility(who: string, which: string, target: string, dice: number, vfx: (effect: vfx) => void, cause: string | null = null) {
  if (!which || !who)
    return;
  const ent = gameState.players[who] || gameState.enemies[who] || gameState.clones[who];
  if (!ent)
    throw new Error('No entity found!');
  const ab = getAbility(which);
  if (ab.cd > 0) {
    ent.abilitiesCD[which] = ab.cd;
  }
  if (!dice)
    throw new Error('No dice value found when executing ability!');
  const roll = Math.ceil(Math.random() * dice);
  if (!ab.cond(roll)) {
    let missEid = who;
    if (!target.includes(',')) {
      if (target !== who) missEid = target;
    }
    else {
      const [x, y, z] = target.split(',').map(Number);
      const entOnTile = checkEnt(x, y + 1, z);
      if (entOnTile) missEid = entOnTile.id;
    }
    vfx({ vfxid: nextVfxId(`miss_${missEid}`), eid: missEid, type: 'miss', amount: null });
    return;
  }
  const resolveId = (id: string) => {
    if (id.startsWith('clone_')) {
      const base = id.replace('clone_', '');
      if (gameState.players[base] || gameState.enemies[base]) return base;
    }
    return id;
  };

  let targets: string[] = [];
  if (!target.includes(',')) {
    targets = [resolveId(target)];
  }
  else {
    const [x, y, z] = target.split(',').map(Number);
    const entOnTile = checkEnt(x, y + 1, z);
    if (entOnTile && !entOnTile.isDead) targets = [resolveId(entOnTile.id)];
  }
  if (ab.AoE) {
    targets = [...new Set([
      ...targets,
      ...getAoE(who, target, ab.AoE, ab.AoErange).map(resolveId),
    ])];
  }
  if (ab.effect && ab.effect[0] === 'move') {
    const attackerBase = who.replace('clone_', '');
    targets = targets.filter(id => id.replace('clone_', '') !== attackerBase);
  }
  targets.forEach((id) => takeAb(who, id, ab, roll, vfx, cause));
}

export function paint(who: string, pos: pos, type: string, range: number, self: boolean) {
  if (gameState.clients[who] && !gameState.clients[who].selectedEnt) return {};
  let valid: Record<string, boolean>;
  switch (type) {
    case 'cross':
      valid = crossTiles(pos, range);
      break;
    case 'circle':
      valid = euclidTiles(pos, range, false);
      break;
    case 'smcircle':
      // Small Meteor: aerial cast targets top-level tiles
      valid = euclidTiles({ x: pos.x, y: gameState.mapBounds.height, z: pos.z }, range, false);
      break;
    case 'rtcircle':
      // Rising Thorns: ground-level cast targets bottom-level tiles (counterpart of smcircle)
      valid = euclidTiles({ x: pos.x, y: 1, z: pos.z }, range, false);
      break;
    case 'sphere':
      valid = euclidTiles(pos, range, true);
      break;
    default:
      valid = {};
  }
  const selectedEnt = gameState.clients[who]?.selectedEnt;
  if (selectedEnt != null) {
    valid[selectedEnt] = false;
    if (self) {
      valid[selectedEnt] = true;
      const entData = getLiveEnt(selectedEnt);
      if (entData) {
        const tileKey = `${entData.position.x},${entData.position.y - 1},${entData.position.z}`;
        valid[tileKey] = true;
      }
    }
  }
  return valid;
}

export function getAbility(name: string) {
  switch (name) {
    case "Stab":
      return {
        name: name,
        type: "cross",
        cond: (x: number) => (x % 2) !== 0,
        range: 1,
        dmg: (res: number) => Math.floor(res / 2),
        cd: 0,
        self: false,
      }
    case "Dagger Throw":
      return {
        name: name,
        type: "cross",
        cond: (x: number) => x > 3,
        range: 3,
        dmg: 2,
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
        effect: ["restrain", '1'],
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
        effect: ["shield", '1'],
        cond: (x: number) => x > 2,
        range: 2,
        dmg: 0,
        cd: 0,
        self: true,
      }
    case "Shield Bash":
      return {
        name: name,
        type: "cross",
        effect: ["move", "away"],
        cond: (x: number) => x >= 5,
        range: 0,
        dmg: 4,
        cd: 2,
        AoE: "cross",
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
        effect: ["boost", '2'],
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
        cd: 1,
        self: false,
        AoE: "cross",
        AoErange: 1,
        displaceFromCenter: true,
        collisionRejects: true,
      }
    case "Bombastic Flask":
      return {
        name: name,
        type: "circle",
        effect: ["move", "away"],
        cond: (x: number) => x > 2,
        range: 2,
        dmg: (res: number) => Math.floor(res / 2) - 2,
        cd: 1,
        self: false,
        AoE: "cross",
        AoErange: 1,
        displaceFromCenter: true,
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
    case "Swoop":
      return {
        name: name,
        type: "cross",
        cond: (x: number) => x > 1,
        range: 1,
        dmg: 1,
        cd: 0,
        self: false,
      }
    case "Claw":
      return {
        name: name,
        type: "cross",
        cond: (x: number) => x > 1,
        range: 1,
        dmg: 1,
        cd: 0,
        self: false,
      }
    case "Push":
      return {
        name: name,
        type: "cross",
        effect: ["move", "away", "2"],
        cond: (x: number) => x > 3,
        range: 1,
        dmg: (x: number) => x,
        cd: 0,
        self: false,
      }
    case "Railgun":
      return {
        name: name,
        type: "circle",
        cond: (x: number) => x > 5,
        range: 6,
        dmg: (x: number) => Math.floor(x / 2),
        cd: 1,
        self: false,
      }
    case "Charge":
      return {
        name: name,
        type: "cross",
        effect: ["move", "away"],
        cond: (x: number) => x > 4,
        range: 3,
        dmg: (x: number) => Math.floor(x / 2),
        cd: 0,
        self: false,
      }
    case "Atomic Bomb":
      return {
        name: name,
        type: "sphere",
        cond: (x: number) => x > 3,
        range: 2,
        dmg: (x: number) => Math.floor(x / 2) + 2,
        cd: 2,
        AoE: "circle",
        AoErange: 2,
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
    Object.values(gameState.enemies).some((e: entity) =>
      e.position.x === x && e.position.y === y && e.position.z === z)
    || Object.values(gameState.players).some((p: entity) => p.id !== baseId
      && p.position.x === x && p.position.y === y && p.position.z === z)
    || Object.values(gameState.clones).some((c: entity) => c.id !== cloneId
      && c.position.x === x && c.position.y === y && c.position.z === z)
  );
}

export function checkEnt(x: number, y: number, z: number) {
  const finder = (e: entity) => (
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
  const nodes = new TinyQueue<{ key: string; d: number }>([], (a: { key: string; d: number }, b: { key: string; d: number }) => a.d - b.d);
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

export function Astar(src: pos, dest: pos, isEnemy: boolean = false) {
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
      const Id = `${nx},${ny},${nz}`;
      const isDest = isEnemy && Id === destKey;
      const isWall = !!gameState.tiles[Id];
      if (isOOB(nx, ny, nz) || isWall || (!isDest && isBlocked(nx, ny, nz)) || !hasFloor(nx, ny, nz))
        continue;
      const newG = node.g + (dy === 1 ? 2 : 1);
      if (Closed.has(Id))
        continue;
      if (bestG[Id] === undefined || newG < bestG[Id]) {
        bestG[Id] = newG;
        const newNode = {
          id: Id,
          pos: { x: nx, y: ny, z: nz },
          g: newG,
          f: newG + heuristic({ x: nx, y: ny, z: nz }, dest)
        };
        Open.push(newNode);
        History[newNode.id] = node.id;
      }
    }
  }
  return [];
}
