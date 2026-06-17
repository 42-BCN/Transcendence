import { create } from 'zustand';
import { gameSocket, ensureChatSessionIdentity } from '@/lib/sockets/socket';

export type pos = {
  x: number,
  y: number,
  z: number
}

export type mapInfo = {
  width: number;
  height: number;
  depth: number;
}

export type tile = {
  id: string,
  type: string,
  position: pos
}

export type parse_entity = {
  id: string,
  type: string,
  position: pos
}

export type player = parse_entity & {
  hp: number;
  maxHp: number;
  armor: number;
  status: string | null;
  statusTurns: number;
  facing: string;
  abilities: string[];
  abilitiesCD: Record<string, number>;
  dice: number[];
  usedDice: number[];
  hasMoved: boolean;
  isDead: boolean;
};

export type enemy = player;

export type entity = player | enemy;

export type node = {
  id: string,
  pos: pos,
  g: number,
  f: number
}

export type historyAction = {
  id: string;
  who: string;
  type: string;
  target: string;
  dice: number;
  aftermov: boolean;
  abName: string | null;
  dependsOn: string | null;
}

export type abilityInfo = {
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

export type vfx = {
  vfxid: string;
  eid: string;
  type: string;
  amount: number | null;
  label: string;
}

export type globalGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END' | 'WIN' | 'LOSE';
  turn: number;
  doom: number;
  players: Record<string, entity>;
  ghosts: Record<string, entity>;
  clones: Record<string, entity>;
  enemies: Record<string, entity>;
  tiles: Record<string, boolean>;
  history: historyAction[];
  vfx: Record<string, vfx>;
  mapBounds: mapInfo;
  readyPlayers?: string[];
  activePlayers?: string[];
}

export type localGameState = {
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  selectedDice: number | null;
}

type gameState = globalGameState & localGameState & {

  //local state
  assignedCharacter: string;
  connectionError: string | null;
  typeEnt: string | null;
  affected: Record<string, boolean>;
  vfx: Record<string, vfx>;
  entityTints: Record<string, { color: string; expiresAt: number }>;

  nextPhase: () => void;
  resetGame: () => void;

  initSocketListeners: () => void;
  cleanupSocketListeners: () => void;

  selectEntity: (Id: string) => void;
  getSel: () => entity | undefined;
  movDice: (mov: number) => void;
  selectDice: (dice: number) => void;
  moveClone: (tileId: string) => void;
  selectAbility: (name: string) => void;
  showMoveRange: (mov: number) => void;
  showAbRange: (name: string) => void;
  resetHistory: () => void;
  addHistoryAbility: (target: string) => void;
  clearHighlights: () => void;
  clearSelectables: () => void;
  clearSelectedDice: () => void;
  aoePreview: Record<string, boolean>;
  setAoePreview: (targetId: string) => void;
  clearAoePreview: () => void;
};

const ABILITY_AOE: Record<string, { type: string; range: number }> = {
  'Shield Bash': { type: 'cross', range: 2 },
  'Vertical Slash': { type: 'vertical', range: 1 },
  'Fire Breath': { type: 'cone', range: 3 },
  'Vacuum Flask': { type: 'cross', range: 1 },
  'Bombastic Flask': { type: 'cross', range: 1 },
  'Atomic Bomb': { type: 'circle', range: 2 },
};

function getAoePreviewTiles(
  targetId: string,
  aoeType: string,
  aoeRange: number,
  tiles: Record<string, boolean>,
  players: Record<string, entity>,
  enemies: Record<string, entity>,
  clones: Record<string, entity>,
  attackerId?: string | null,
): Record<string, boolean> {
  let cx: number, cy: number, cz: number;
  if (targetId.includes(',')) {
    [cx, cy, cz] = targetId.split(',').map(Number);
    cy = cy + 1;
  } else {
    const ent = players[targetId] || enemies[targetId] || clones[targetId];
    if (!ent)
      return {};
    ({ x: cx, y: cy, z: cz } = ent.position);
  }

  const result: Record<string, boolean> = {};

  const markTile = (x: number, y: number, z: number) => {
    const key = `${x},${y - 1},${z}`;
    if (tiles[key]) result[key] = true;
  };

  if (aoeType === 'cross') {
    const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
    for (const [dx, dz] of DIRS) {
      for (let n = 1; n <= aoeRange; ++n) {
        const x = cx + n * dx;
        const z = cz + n * dz;
        if (tiles[`${x},${cy},${z}`])
          break;
        const floorKey = `${x},${cy - 1},${z}`;
        if (!tiles[floorKey])
          break;
        result[floorKey] = true;
      }
    }
  } else if (aoeType === 'circle') {
    for (let dx = -aoeRange; dx <= aoeRange; ++dx) {
      for (let dz = -aoeRange; dz <= aoeRange; ++dz) {
        if (aoeRange * aoeRange < dx * dx + dz * dz)
          continue;
        markTile(cx + dx, cy, cz + dz);
      }
    }
  } else if (aoeType === 'vertical') {
    markTile(cx, cy, cz);
    markTile(cx, cy + 1, cz);
    markTile(cx, cy - 1, cz);
  } else if (aoeType === 'cone') {
    if (!attackerId)
      return result;
    const attacker =
      players[attackerId] ||
      clones[attackerId] ||
      players[attackerId.replace('clone_', '')] ||
      clones[`clone_${attackerId}`];
    if (!attacker)
      return result;
    const o = attacker.position;
    const fx = Math.sign(cx - o.x);
    const fz = Math.sign(cz - o.z);
    const [px, pz] = [fz, fx];
    const CONE = [
      [1, 0, 0], [2, 0, 0], [2, 1, 0], [2, -1, 0], [2, 0, -1],
      [2, 0, 1], [3, 0, 0], [3, 1, 0], [3, -1, 0], [3, 0, 1],
      [3, 1, 1], [3, -1, 1], [3, 0, -1], [3, 1, -1], [3, -1, -1],
    ] as const;
    for (const [fwd, hgt, prp] of CONE) {
      const x = o.x + fx * fwd + px * prp;
      const y = o.y + hgt;
      const z = o.z + fz * fwd + pz * prp;
      markTile(x, y, z);
    }
  }
  return result;
}

export const useGame = create<gameState>()((set, get) => ({

  assignedCharacter: 'spectator',
  connectionError: null,

  turn: 1,
  doom: 0,
  phase: 'PLAN',
  canSelect: true,
  typeEnt: null,
  selectedAb: null,
  selectedEnt: null,
  selectedDice: null,

  players: {},
  ghosts: {},
  enemies: {},
  clones: {},
  tiles: {},
  highlights: {},
  entityTints: {},
  selectables: {},
  aoePreview: {},
  affected: {},
  vfx: {},
  history: [],
  readyPlayers: [],
  activePlayers: [],
  mapBounds: { width: 0, height: 0, depth: 0 },

  nextPhase: () => {
    gameSocket.emit('game:client:toggleEndTurn');
    gameSocket.emit('game:client:nextPhase');
  },

  resetGame: () => {
    gameSocket.emit('game:client:resetGame');
  },

  selectEntity: (id) => {
    gameSocket.emit('game:client:selectEntity', id);
    console.log('ent id: ', id);
  },

  getSel: () => {
    const s = get();
    if (!s.selectedEnt) return;
    const id = s.selectedEnt;
    return s.players[id] || s.enemies[id] || s.clones[id];
  },

  showMoveRange: (mov) => {
    gameSocket.emit('game:client:showMoveRange', mov);
  },

  movDice: (mov) => {
    gameSocket.emit('game:client:displayMoveRange', mov);
  },

  selectDice: (dice) => {
    gameSocket.emit('game:client:selectDice', dice);
  },

  resetHistory: () => {
    console.log('history before reset:', get().history);
    gameSocket.emit('game:client:resetHistory');
  },

  addHistoryAbility: (target: string) => {
    console.log('history before ability: ', get().history);
    set({ aoePreview: {} });
    gameSocket.emit('game:client:addHistoryAbility', target);
  },

  moveClone: (tileId) => {
    console.log('history before move: ', get().history);
    gameSocket.emit('game:client:moveClone', tileId);
  },

  selectAbility: (name) => {
    const state = get();
    const ent = state.getSel();
    if (!ent) throw new Error('no ent id!');
    gameSocket.emit('game:client:displayAbilityRange', ent.id, name);
  },

  showAbRange: (name) => {
    const ent = get().getSel();
    if (!ent) throw new Error('no ent id!');
    gameSocket.emit('game:client:showAbilityRange', ent.id, name);
  },

  clearSelectedDice: () => {
    gameSocket.emit('game:client:clearSelDice');
    set({ selectedDice: null });
  },

  clearHighlights: () => {
    gameSocket.emit('game:client:clearHl');
    set({ highlights: {} });
  },

  clearSelectables: () => {
    gameSocket.emit('game:client:clearSl');
    set({ selectables: {}, canSelect: true, aoePreview: {} });
  },

  setAoePreview: (targetId) => {
    const s = get();
    const ab = s.selectedAb ? ABILITY_AOE[s.selectedAb] : undefined;
    if (!ab) return;
    const preview = getAoePreviewTiles(
      targetId, ab.type, ab.range,
      s.tiles, s.players, s.enemies, s.clones,
      s.selectedEnt,
    );
    set({ aoePreview: preview });
  },

  clearAoePreview: () => {
    set({ aoePreview: {} });
  },

  initSocketListeners: () => {
    gameSocket.off('connect');
    gameSocket.off('disconnect');
    gameSocket.off('game:server:join');
    gameSocket.off('game:server:globalSync');
    gameSocket.off('game:server:sync');
    (gameSocket as any).off('game:server:error');
    const handleJoin = (id: string) => {
      console.log('👤 Player joined with ID:', id);
      set({ assignedCharacter: id, connectionError: null });
    };

    const handleGlobalSync = (state: globalGameState) => {
      console.log('📡 Received global sync');
      console.log('history after action: ', state.history);
      console.log('activePlayers after action: ', state.activePlayers);
      console.log('readyPLayers after action: ', state.readyPlayers);
      const prevPhase = get().phase;
      const isGameReset =
        (prevPhase === 'WIN' || prevPhase === 'LOSE') && state.phase === 'PLAN';

      set({
        phase: state.phase,
        turn: state.turn,
        doom: state.doom,
        enemies: state.enemies,
        players: state.players,
        ghosts: state.ghosts,
        clones: state.clones,
        history: state.history,
        tiles: state.tiles || get().tiles,
        mapBounds: state.mapBounds || get().mapBounds,
        readyPlayers: state.readyPlayers || get().readyPlayers,
        activePlayers: state.activePlayers || get().activePlayers,
        ...(isGameReset ? { vfx: {}, entityTints: {}, aoePreview: {} } : {}),
      });
    };

    const handleVfx = (effect: vfx) => {
      if (!effect)
        return;
      const label =
        effect.type === 'damage' ? `-${effect.amount}` :
          effect.type === 'doom' ? `☠ +${effect.amount ?? 0}` :
            effect.type === 'burn' ? `🔥 ${effect.type}` :
              effect.type === 'restrain' ? `⛓ ${effect.type}` :
                effect.type === 'oxidation' ? `⚗ ${effect.type}` :
                  effect.type === 'boost' ? `⚡ ${effect.type}` :
                    effect.type === 'shield' ? `🛡 ${effect.type}` :
                      effect.type === 'miss' ? `✗ MISS` :
                        effect.type;
      set((s) => ({
        vfx: {
          ...s.vfx,
          [effect.vfxid]: {
            vfxid: effect.vfxid,
            eid: effect.eid,
            type: effect.type,
            amount: effect.amount,
            label,
          },
        },
      }));
      setTimeout(() => {
        set((s) => {
          const next = { ...s.vfx };
          delete next[effect.vfxid];
          return { vfx: next };
        });
      }, 1400);
      if (effect.type === 'damage' || effect.type === 'miss') {
        const tintColor = effect.type === 'damage' ? '#ff2222' : '#22ff66';
        const eid = effect.eid;
        const expiresAt = Date.now() + 500;
        set((s) => ({
          entityTints: { ...s.entityTints, [eid]: { color: tintColor, expiresAt } },
        }));
        setTimeout(() => {
          set((s) => {
            const existing = s.entityTints[eid];
            if (!existing || existing.expiresAt > Date.now()) return s;
            const { [eid]: _removed, ...rest } = s.entityTints;
            return { entityTints: rest };
          });
        }, 550);
      }
    };

    const handleSync = (state: localGameState) => {
      if (!state) return;
      console.log('🔄 Received sync event');
      set({
        highlights: state.highlights,
        selectables: state.selectables,
        canSelect: state.canSelect,
        selectedAb: state.selectedAb,
        selectedEnt: state.selectedEnt,
        selectedDice: state.selectedDice,
        aoePreview: {},
      });
    };

    const handleGameError = (message: string) => {
      console.error('🎮 game socket error:', message);
      set({
        connectionError: message,
        mapBounds: { width: 0, height: 0, depth: 0 },
      });
    };

    gameSocket.on('connect', () => {
      console.log('✅ Connected to game socket server');
    });

    gameSocket.on('disconnect', () => {
      console.log('❌ Disconnected from game socket:');
    });

    gameSocket.on('game:server:join', handleJoin);
    (gameSocket as any).on('game:server:globalSync', handleGlobalSync);
    gameSocket.on('game:server:sync', handleSync);
    (gameSocket as any).on('game:server:vfx', handleVfx);
    (gameSocket as any).on('game:server:error', handleGameError);

    ensureChatSessionIdentity()
      .finally(() => gameSocket.connect());
  },

  cleanupSocketListeners: () => {
    gameSocket.off('connect');
    gameSocket.off('disconnect');
    gameSocket.off('connect_error');
    gameSocket.off('game:server:join');
    gameSocket.off('game:server:init');
    (gameSocket as any).off('game:server:globalSync');
    gameSocket.off('game:server:sync');
    (gameSocket as any).off('game:server:vfx');
    (gameSocket as any).off('game:server:error');
    gameSocket.disconnect();
  },
}));
