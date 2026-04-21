import { z } from 'zod';

import { VALIDATION, type ValidationCode } from '../../api/http/validation';

export type pos = {
  x: number;
  y: number;
  z: number;
};

export type parse_entity = {
  id: string;
  type: string;
  position: pos;
};

export type player = parse_entity & {
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

export type enemy = player;

export type entity = player | enemy;

export type ability = {
  name: string;
  target: string;
  dice: number;
  aftermov: boolean;
};

export type historyAction = {
  who: string;
  moveto: string | null;
  abilities?: ability[];
};

export type mapInfo = {
  width: number;
  height: number;
  depth: number;
};

export type serverGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END';
  turn: number;
  players: Record<string, entity>;
  clones: Record<string, entity>;
  enemies: Record<string, entity>;
  tiles: Record<string, boolean>;
  clients: Record<string, clientGameState>;
  history: historyAction[];
  mapBounds: mapInfo;
};

export type clientGameState = {
  id: string;
  highlights: Record<string, boolean>;
  selectables: Record<string, boolean>;
  canSelect: boolean;
  selectedAb: string | null;
  selectedEnt: string | null;
  selectedDice: number | null;
};

export type ClientToServerGameEvents = {
  'game:client:rolls': (quantity: number) => void;
  'game:client:displayMoveRange': (quantity: number) => void;
  'game:client:displayAbilityRange': (abName: string) => void;
  'game:client:clearHl': () => void;
  'game:client:clearSl': () => void;
};

export type ServerToClientGameEvents = {
  'game:server:rolls': (totalRolls: number) => void;
  'game:server:join': (assignedRole: string) => void;
  'game:server:init': (state: serverGameState) => void;
  'game:server:globalSync': (state: serverGameState) => void;
  'game:server:sync': (state: clientGameState) => void;
  'game:server:displayMoveRange': (highlights: Record<string, boolean>) => void;
  'game:server:displayAbilityRange': (selectables: Record<string, boolean>) => void;
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
