import { z } from 'zod';

import { VALIDATION, type ValidationCode } from '../../api/http/validation';

export const emptyMap = ``

export type pos = {
  x: number,
  y: number,
  z: number
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


type info = {
  width: number; //x
  height: number; //y
  depth: number; //z
  enenum: number;
  entities: parse_entity[];
  tiles: tile[];
}

export const posSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  z: z.number()
})

export const tileSchema = z.object({
  id: z.string(),
  x: z.string(),
})

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


type info = {
  width: number; //x
  height: number; //y
  depth: number; //z
  enenum: number;
  entities: parse_entity[];
  tiles: tile[];
}
export type ClientToServerGameEvents = {
  'game:client:rolls': (quantity: number) => void;
  'game:client:displayMoveRange': (range: number) => void;
};

export type ServerToClientGameEvents = {
  'game:server:rolls': (totalRolls: number) => void;
  'game:server:displayMoveRange': (range: number) => void;
};

export const GameEventMapInfo = z.object({
  id: z.string(),
  payload: z.unknown(),
});

export const UpdatePlanPayloadSchema = z.object({
  id: z.string(),
  payload: z.unknown(),
});

export type GameEventPayload = z.infer<typeof GameEventPayloadSchema>;
export type UpdatePlanPayload = z.infer<typeof UpdatePlanPayloadSchema>;
