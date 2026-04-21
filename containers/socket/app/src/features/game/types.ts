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
  dice: number[];
  usedDice: number[];
  hasMoved: boolean;
};

export type enemy = player;

export type entity = player | enemy;

export type node = {
  id: string,
  pos: pos,
  g: number,
  f: number
}

export type ability = {
  name: string;
  target: string;
  dice: number;
  aftermov: boolean;
}

export type historyAction = {
  who: string;
  moveto: string | null;
  abilities?: ability[];
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

export type serverGameState = {
  phase: 'PLAN' | 'EXEC' | 'ENEMY' | 'END',
  turn: number,
  players: Record<string, entity>;
  clones: Record<string, entity>;
  enemies: Record<string, entity>;
  tiles: Record<string, boolean>;
  clients: Record<string, clientGameState>
  history: historyAction[];
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

