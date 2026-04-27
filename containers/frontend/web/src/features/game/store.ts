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
  vfx: vfx[];
  readyPlayers: string[];
  activePlayers: string[];
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
  abilitiesCD: Record<string, number>;
  dice: number[];
  usedDice: number[];
  hasMoved: boolean;
};

type vfx = {
  id: string;
  type: string;
  amount: string | number | null;
}

type enemy = player;

type entity = player | enemy;

type mapInfo = {
  width: number;
  height: number;
  depth: number;
};

export type historyAction = {
  who: string;
  type: string;
  target: string;
  dice: number;
  aftermov: boolean;
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
  readyPlayers: string[];
  activePlayers: string[];

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
    gameSocket.emit('game:client:toggleEndTurn');
    gameSocket.emit('game:client:nextPhase');
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

  resetHistory: () => {
    console.log('history before reset:', get().history);
    gameSocket.emit('game:client:resetHistory');
  },

  addHistoryAbility: (target) => {
    console.log('history before ability: ', get().history);
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
    set({ selectables: {}, canSelect: true });
  },

  handleRightClick: () => {
    gameSocket.emit('game:client:rClick');
  },


  initSocketListeners: () => {
    const handleJoin = (id: string) => {
      console.log('👤 Player joined with ID:', id);
      set({ assignedCharacter: id });
    };

    const handleGlobalSync = (state: globalGameState) => {
      console.log('📡 Received global sync');
      console.log('history after action: ', state.history);
      console.log('activePlayers after action: ', state.activePlayers);
      console.log('readyPLayers after action: ', state.readyPlayers);

      set({
        phase: state.phase,
        turn: state.turn,
        enemies: state.enemies,
        players: state.players,
        clones: state.clones,
        history: state.history,
        tiles: state.tiles || get().tiles,
        mapBounds: state.mapBounds || get().tiles,
        readyPlayers: state.readyPlayers || get().readyPlayers,
        activePlayers: state.activePlayers || get().activePlayers,
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

    ensureChatSessionIdentity()
      .then(() => {
        console.log('✅ Session established, connecting to game socket...');
      })
      .catch((err) => {
        console.error('❌ Session failed, attempting to connect anyway:', err);
      })
      .finally(() => {
        gameSocket.connect();
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
