import { z } from 'zod';

import { VALIDATION, type ValidationCode } from '../../api/http/validation';

export type ClientToServerEvents = {
  'testEvent': (payload: GameEventPayload) => void;
  'update-plan': (payload: UpdatePlanPayload) => void;
};

export type ServerToClientGameEvents = {
  'test-stcevent': (payload: GameEventPayload) => void;
  'update-plan': (payload: UpdatePlanPayload) => void;
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
