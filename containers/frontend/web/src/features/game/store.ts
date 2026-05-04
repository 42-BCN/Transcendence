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
  id: string;
  type: string;
  amount: string | number | null;
}

export type globalGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END',
  turn: number,
  players: Record<string, entity>;
  ghosts: Record<string, entity>;
  clones: Record<string, entity>;
  enemies: Record<string, entity>;
  tiles: Record<string, boolean>;
  history: historyAction[];
  vfx: vfx[];
  mapBounds: mapInfo,
}

export type localGameState = {
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  selectedDice: number | null;
}

type gameState = {

  assignedCharacter: string;

  //global state
  turn: number;
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END';
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

  nextPhase: () => void;

  initSocketListeners: () => void;
  cleanupSocketListeners: () => void;

  selectEntity: (Id: string) => void;
  getSel: () => entity | undefined;
  movDice: (mov: number) => void;
  selectDice: (dice: number) => void;
  moveClone: (tileId: string) => void;
  selectAbility: (name: string) => void;
  showMoveRange: (mov: string) => void;
  showAbRange: (name: string) => void;
  clearHighlights: () => void;
  clearSelectables: () => void;
};

export const useGame = create<gameState>()((set, get) => ({

  assignedCharacter: 'spectator',

  turn: 1,
  phase: 'PLAN',
  canSelect: true,
  typeEnt: null,
  selectedAb: null,
  selectedEnt: null,
  selectedDice: null,

  players: {},
  enemies: {},
  clones: {},
  tiles: {},
  highlights: {},
  selectables: {},
  affected: {},
  history: [],
  readyPlayers: [],
  activePlayers: [],
  mapBounds: { width: 0, height: 0, depth: 0 },

  nextPhase: () => {
    gameSocket.emit('game:client:toggleEndTurn');
    gameSocket.emit('game:client:nextPhase');
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
        mapBounds: state.mapBounds || get().mapBounds,
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

    gameSocket.on('disconnect', () => {
      console.log('❌ Disconnected from game socket:');
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
