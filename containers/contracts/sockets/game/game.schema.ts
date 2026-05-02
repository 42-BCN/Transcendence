import { z } from 'zod';

import { VALIDATION, type ValidationCode } from '../../api/http/validation';

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

export type serverGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END',
  turn: number,
  players: Record<string, entity>;
  ghosts: Record<string, entity>;
  clones: Record<string, entity>;
  enemies: Record<string, entity>;
  tiles: Record<string, boolean>;
  clients: Record<string, clientGameState>
  history: historyAction[];
  vfx: vfx[];
  mapBounds: mapInfo,
}

export type clientGameState = {
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  selectedDice: number | null;
}

export interface ClientToServerGameEvents {
  'game:client:showMoveRange': (diceValue: number) => void;
  'game:client:displayMoveRange': (diceValue: number) => void;
  'game:client:selectEntity': (id: string) => void;
  'game:client:selectDice': (diceValue: number) => void;
  'game:client:displayAbilityRange': (who: string, abName: string) => void;
  'game:client:showAbilityRange': (who: string, abName: string) => void;
  'game:client:clearHl': () => void;
  'game:client:clearSl': () => void;
  'game:client:clearSelDice': () => void;
  'game:client:moveClone': (tileId: string) => void;
  'game:client:addHistoryAbility': (target: string) => void;
  'game:client:toggleEndTurn': () => void;
  'game:client:nextPhase': () => void;
  'game:client:rClick': () => void;
  'game:client:resetHistory': () => void;
  'game:client:sync': () => void;
  'game:client:globalSync': () => void;
}

export type ServerToClientGameEvents = {
  'game:server:join': (assignedRole: string) => void;
  'game:server:init': (state: serverGameState) => void;
  'game:server:globalSync': (state: serverGameState) => void;
  'game:server:sync': (state: clientGameState) => void;
};
export const GameEventMapInfo = z.object({
  id: z.string(),
  payload: z.unknown(),
});

export const UpdatePlanPayloadSchema = z.object({
  id: z.string(),
  payload: z.unknown(),
});

// export type GameEventPayload = z.infer<typeof GameEventPayloadSchema>;
export type UpdatePlanPayload = z.infer<typeof UpdatePlanPayloadSchema>;
