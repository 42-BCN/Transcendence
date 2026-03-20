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
  type: z.literal('user'),
  content: z.object({
    text: z.string(),
  }),
  createdAt: z.number(),
  id: z.string(),
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
  type: 'error';
  username?: string;
  content: {
    text: ChatErrorCode;
    details: ZodValidationError[];
  };
  createdAt: number;
  id: string;
};

// ---------------------------------------------------------------- Error Handling end

export const ChatSystemMessageSchema = z.object({
  type: z.literal('system'),
  content: z.object({
    text: z.enum(['USER_JOINED', 'USER_LEFT']),
  }),
  username: z.string().optional(),
  createdAt: z.number(),
  id: z.string(),
});
export type ChatSystemMessage = z.infer<typeof ChatSystemMessageSchema>;

export const ChatMeSchema = z.object({
  username: z.string(),
  type: z.literal('me'),
  content: z.object({
    text: z.string(),
  }),
  createdAt: z.number(),
  id: z.string(),
});
export type ChatMe = z.infer<typeof ChatMeSchema>;

export const ChatMessageUnionSchema = z.union([
  ChatMessageSchema,
  ChatSystemMessageSchema,
  ChatMeSchema,
]);

export type ChatMessageUnion = ChatMessage | ChatSystemMessage | ChatError | ChatMe;

export const ChatHistorySchema = z.object({
  messages: z.array(ChatMessageUnionSchema),
});
export type ChatHistory = z.infer<typeof ChatHistorySchema>;

// ---------------------------------------------------------------- Server to Client Schema end
