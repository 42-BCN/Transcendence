import { z } from 'zod';

import { VALIDATION, type ValidationCode } from '../../api/http/validation';

export type ClientToServerGameEvents = {
  'game:client:rolls': (quantity: number) => void;
};

export type ServerToClientGameEvents = {
  'game:server:rolls': (totalRolls: number) => void;
};

export const GameEventPayloadSchema = z.object({
  id: z.string(),
  payload: z.unknown(),
});

export const UpdatePlanPayloadSchema = z.object({
  id: z.string(),
  payload: z.unknown(),
});

export type GameEventPayload = z.infer<typeof GameEventPayloadSchema>;
export type UpdatePlanPayload = z.infer<typeof UpdatePlanPayloadSchema>;
