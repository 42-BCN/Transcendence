import { z } from 'zod';

import { VALIDATION, type ValidationCode } from '../../api/http/validation';

export type ClientToServerEvents = {
  'test-ctsevent': (payload: GameEventPayload) => void;
};

export type ServerToClientGameEvents = {
  'test-stcevent': (payload: GameEventPayload) => void;
};

export const GameEventPayloadSchema = z.object({
  name: z.string(),
  payload: z.unknown(),
});

export type GameEventPayload = z.infer<typeof GameEventPayloadSchema>;
