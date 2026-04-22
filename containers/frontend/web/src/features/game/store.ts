import { create } from 'zustand';
import type { parse_entity, pos, tile } from './maps';
import { gameSocket, ensureChatSessionIdentity } from '@/lib/sockets/socket';

export type globalGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END';
  turn: number;
  players: Record<string, player>;
  clones: Record<string, player>;
  enemies: Record<string, enemy>;
  tiles: Record<string, boolean>;
  history: historyAction[];
  mapBounds: mapInfo;
};

export type localGameState = {
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  selectedDice: number | null;
};

type gamePhase = 'PLAN' | 'EXEC' | 'ENEMY' | 'END';

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
  id: string;
  pos: pos;
  g: number;
  f: number;
};

type mapInfo = {
  width: number;
  height: number;
  depth: number;
};

type ability = {
  name: string;
  target: string;
  dice: number;
  aftermov: boolean;
};

type historyAction = {
  who: string;
  moveto: string | null;
  abilities?: ability[];
};

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
};

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
};

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
  phase: 'PLAN',

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
    if (state.phase !== 'PLAN') return;
    set({ ...clean, phase: 'EXEC', canSelect: false });
    try {
      await get().executionPhase();
      set({ ...clean, phase: 'ENEMY', canSelect: false });
      await get().enemyPhase();
      set({ phase: 'END' });
      get().endTurn();
    } catch (err) {
      console.error('Turn resolution failed:', err);
      set({ ...clean, phase: 'PLAN', canSelect: true });
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
    console.log('Enemy turn');
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
      phase: 'PLAN',
      history: [],
      clones: {},
      players: updatedPlayers,
      enemies: updatedEnemies,
      canSelect: true,
    });
    console.log('New turn');
  },

  selectEntity: (id) => {
    const state = get();
    gameSocket.emit('game:client:selectEntity', id);
    let ent = state.players[id] || state.enemies[id] || state.clones[id];
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

  // addHistory: (id, type, target, dice = 0, ability = "") => set((state) => {
  //   const len = state.history.length;
  //   const who = id.startsWith("clone_") ? id.replace("clone_", "") : id;
  //   const exists = state.history.some((h) => h.who === who);
  //   //    const ent = state.players[id] || state.enemies[id] || state.clones[id];
  //
  //   if (!exists && len >= 4)
  //     throw new Error("History over 4 elements!");
  //   console.log("history: ", state.history);
  //   let lastAction = null;
  //   const newHistory = [...state.history];
  //   //getprev
  //   for (let i = 0; i < len; ++i) {
  //     if (who !== newHistory[i].who)
  //       continue;
  //     [lastAction] = newHistory.splice(i, 1);
  //     break;
  //   }
  //   if (!lastAction) {
  //     newHistory.push({
  //       who: who,
  //       moveto: type === "mov" ? target : null,
  //       abilities: type === "ability" ? [{ name: ability, target: target, dice: dice, aftermov: false }] : [],
  //     });
  //     console.log("newHistory: ", newHistory);
  //     return { history: newHistory };
  //   }
  //   const newAction = { ...lastAction };
  //   if (type === "ability") {
  //     const aftermov = Boolean(lastAction.moveto) && id !== who;
  //     newAction.abilities = [...(lastAction.abilities || []), {
  //       name: ability,
  //       target: target,
  //       dice: dice,
  //       aftermov: aftermov
  //     }];
  //     if (lastAction.moveto && !aftermov) {
  //       const { [`clone_${who}`]: _, ...remainingClones } = state.clones;
  //       newAction.moveto = null;
  //       newHistory.push(newAction);
  //       console.log("newHistory from inside the clone deletion: ", newHistory);
  //       return { clones: { ...remainingClones }, history: newHistory };
  //     }
  //   }
  //   else if (type === "mov") {
  //     newAction.moveto = target;
  //     newAction.abilities = lastAction.abilities?.filter((ab) => ab.aftermov === false) || [];
  //   }
  //   newHistory.push(newAction);
  //   console.log("newHistory: ", newHistory);
  //   return { history: newHistory };
  // }),

  addHistoryAbility: (target) => {
    gameSocket.emit('game:client:addHistoryAbility', target);
  },

  moveClone: (tileId) => {
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

  takeAb: (id, type, ab, roll) => {
    const state = get();
    const target = type === 'enemy' ? { ...state.enemies[id] } : { ...state.players[id] };

    target.hp = target.hp - (typeof ab.dmg === 'function' ? ab.dmg(roll) : ab.dmg);
    if (target.hp < 0) target.hp = 0;
    const hadStatus = Boolean(target.status);
    if (!target.status && ab.effect) {
      target.status = ab.effect[0];
      if (target.status !== 'push' && !hadStatus) target.statusTurns = Number(ab.effect[1]);
    }
    return target;
  },

  executeAbility: (who, which, target) => {
    const state = get();
    if (!which || !who) return;
    const ent = state.players[who] || state.enemies[who] || state.clones[who];
    const ab = state.getAbility(which);
    if (!ent) throw new Error('No entity found!');
    const ability = state.history
      .find((h) => h.who === who)
      ?.abilities?.find((a) => a.name === which && a.target === target);
    const dvalue = ability?.dice;
    if (!dvalue) throw new Error('No dice value found when executing ability!');
    const roll = Math.ceil(Math.random() * dvalue);
    if (!ab.cond(roll)) return;
    const targets = [target];
    // if (ab.AoE)
    //   targets.push(...state.getAoE(pos, ab.AoEtype, AoErange));
    const changedPlayers: player[] = [];
    const changedEnemies: enemy[] = [];
    targets.forEach((id) => {
      if (state.enemies[id]) changedEnemies.push(state.takeAb(id, 'enemy', ab, roll));
      else if (state.players[id]) changedPlayers.push(state.takeAb(id, 'player', ab, roll));
    });
    set({
      players: { ...state.players, ...Object.fromEntries(changedPlayers.map((p) => [p.id, p])) },
      enemies: { ...state.enemies, ...Object.fromEntries(changedEnemies.map((e) => [e.id, e])) },
    });
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
    set({ selectables: {}, canSelect: true });
  },

  initSocketListeners: () => {
    const connect = async () => {
      try {
        console.log('🔐 Establishing session before connecting to game socket...');
        await ensureChatSessionIdentity();
        console.log('✅ Session established, connecting to game socket...');
      } catch (error) {
        console.error('❌ Failed to establish session:', error);
      }

      const handleJoin = (id: string) => {
        console.log('👤 Player joined with ID:', id);
        set({ assignedCharacter: id });
      };

      const handleGlobalSync = (state: globalGameState) => {
        console.log('📡 Received global sync with mapBounds:', state.mapBounds);
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
        if (!state)
          return;
        console.log('🔄 Received sync event');
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
        console.log('🎲 Received rolls update:', quantity);
        set({ rollQuantity: quantity });
      };

      const handleHighlights = (highlights: Record<string, boolean>) => {
        console.log('✨ Received highlights');
        set({ highlights: highlights });
      };

      const handleSelectables = (selectables: Record<string, boolean>) => {
        console.log('🎯 Received selectables');
        set({ selectables: selectables });
      };

      gameSocket.on('connect', () => {
        console.log('✅ Connected to game socket server');
      });

      gameSocket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from game socket:', reason);
      });

      gameSocket.on('connect_error', (error) => {
        console.error('🔴 Game socket connection error:', error);
      });

      gameSocket.on('error', (error) => {
        console.error('🔴 Game socket error:', error);
      });

      gameSocket.on('game:server:join', handleJoin);
      gameSocket.on('game:server:globalSync', handleGlobalSync);
      gameSocket.on('game:server:sync', handleSync);
      gameSocket.on('game:server:displayMoveRange', handleHighlights);
      gameSocket.on('game:server:displayAbilityRange', handleSelectables);

      console.log('🚀 Connecting game socket...');
      gameSocket.connect();
    };

    connect().catch((err) => {
      console.error('❌ Failed to initialize socket listeners:', err);
    });
  },

  cleanupSocketListeners: () => {
    gameSocket.off('connect');
    gameSocket.off('disconnect');
    gameSocket.off('connect_error');
    gameSocket.off('error');
    gameSocket.off('game:server:join');
    gameSocket.off('game:server:init');
    gameSocket.off('game:server:globalSync');
    gameSocket.off('game:server:sync');
    gameSocket.off('game:server:displayMoveRange');
    gameSocket.off('game:server:displayAbilityRange');
    gameSocket.disconnect();
  },
}));
