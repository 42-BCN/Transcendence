import { z } from 'zod';

import { VALIDATION } from '../http/validation';

// TODO ID MOVE ZOD VALITATION TO A COMMON PLACE
// TODO create a table for i18n

export const ChatSendSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, VALIDATION.REQUIRED)
    .max(300, VALIDATION.FIELD_TOO_LONG)
    .transform((val: string) => val.trim()),
});

export const ChatMessageSchema = z.object({
  id: z.uuid(),
  matchId: z.uuid(),

  sender: z.object({
    id: z.uuid(),
    username: z.string(),
  }),

  content: z.object({
    text: z.string(),
  }),

  createdAt: z.number(),
});

export const ChatSystemMessageSchema = z.object({
  type: z.enum(['USER_JOINED', 'USER_LEFT']),
  userId: z.uuid().optional(),
  matchId: z.uuid(),
  createdAt: z.number(),
});

export const ChatHistorySchema = z.object({
  messages: z.array(ChatMessageSchema),
});

export type ChatSend = z.infer<typeof ChatSendSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatSystemMessage = z.infer<typeof ChatSystemMessageSchema>;
export type ChatHistory = z.infer<typeof ChatHistorySchema>;
