import { z } from 'zod';

import { VALIDATION, type ValidationCode } from '../../api/http/validation';

// ---------------------------------------------------------------- Client to Server Schema start
export const ChatSendSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: VALIDATION.REQUIRED })
    .max(300, { message: VALIDATION.FIELD_TOO_LONG })
    .transform((val: string) => val.trim()),
});

export type ChatSend = z.infer<typeof ChatSendSchema>;
// ---------------------------------------------------------------- Client to Server Schema end
// ---------------------------------------------------------------- Server to Client Schema start
// ---------------------------------------------------------------- Message Schema start
export const ChatMessageSchema = z.object({
  username: z.string(),
  content: z.object({
    text: z.string(),
  }),
  createdAt: z.number(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
// ---------------------------------------------------------------- Message Schema end
// ---------------------------------------------------------------- Error Handling start

export const CHAT_ERRORS = ['INVALID_CHAT_MESSAGE'] as const;
type ChatErrorCode = (typeof CHAT_ERRORS)[number];

type ZodValidationError = {
  fieldName: PropertyKey[];
  errCode: ValidationCode;
};

export type ChatError = {
  code: ChatErrorCode;
  details?: ZodValidationError[];
};

// ---------------------------------------------------------------- Error Handling end

export const ChatSystemMessageSchema = z.object({
  type: z.enum(['USER_JOINED', 'USER_LEFT']),
  username: z.string().optional(),
  createdAt: z.number(),
});

export const ChatHistorySchema = z.object({
  messages: z.array(ChatMessageSchema),
});

export type ChatSystemMessage = z.infer<typeof ChatSystemMessageSchema>;
export type ChatHistory = z.infer<typeof ChatHistorySchema>;
// ---------------------------------------------------------------- Server to Client Schema end
