import { z } from 'zod';

import { VALIDATION } from '../../api/http/validation';

export type ClientToServerChatEvents = {
  'chat:send': (payload: ChatSend) => void;
};

export const GameEventPayloadSchema = z.object({
  name: z.string(),
  payload: z.unknown(),
});

export type GameEventPayload = z.infer<typeof GameEventPayloadSchema>;

export type ServerToClientChatEvents = {
  'chat:message': (payload: ChatMessage) => void;
  'chat:system': (payload: ChatSystemMessage) => void;
  'chat:error': (payload: ChatError) => void;
  'chat:history': (payload: ChatHistoryType) => void;
  'chat:game-event': (payload: ChatGameEvent) => void;
};

// ---------------------------------------------------------------
// shared
// ---------------------------------------------------------------

export const MessageIdSchema = z.string();
export const MessageTimestampSchema = z.number();

const BaseMessageSchema = z.object({
  id: MessageIdSchema,
  createdAt: MessageTimestampSchema,
  username: z.string().optional(),
});

const TextContentSchema = z.object({
  text: z.string(),
});

// ---------------------------------------------------------------
// client -> server
// ---------------------------------------------------------------

export const ChatSendSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: VALIDATION.REQUIRED })
    .max(300, { message: VALIDATION.FIELD_TOO_LONG })
    .transform((val: string) => val.trim()),
});

export type ChatSend = z.infer<typeof ChatSendSchema>;

// ---------------------------------------------------------------
// server -> client
// ---------------------------------------------------------------

export const ChatMessageSchema = BaseMessageSchema.extend({
  type: z.literal('user'),
  username: z.string(),
  content: TextContentSchema,
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatMeSchema = BaseMessageSchema.extend({
  type: z.literal('me'),
  username: z.string(),
  content: TextContentSchema,
});

export type ChatMe = z.infer<typeof ChatMeSchema>;

export const ChatSystemMessageSchema = BaseMessageSchema.extend({
  type: z.literal('system'),
  content: z.object({
    text: z.enum(['USER_JOINED', 'USER_LEFT']),
  }),
});

export type ChatSystemMessage = z.infer<typeof ChatSystemMessageSchema>;

// ---------------------------------------------------------------
// error
// ---------------------------------------------------------------

export const CHAT_ERRORS = ['INVALID_CHAT_MESSAGE'] as const;
export type ChatErrorCode = (typeof CHAT_ERRORS)[number];

export const ChatErrorSchema = BaseMessageSchema.extend({
  type: z.literal('error'),
  content: z.object({
    text: z.enum(CHAT_ERRORS),
  }),
});

export type ChatError = z.infer<typeof ChatErrorSchema>;

export const ChatGameEventSchema = BaseMessageSchema.extend({
  type: z.literal('game-event'),
  content: z.object({
    text: z.string(),
    payload: z.unknown(),
  }),
});

export type ChatGameEvent = z.infer<typeof ChatGameEventSchema>;

// ---------------------------------------------------------------
// union
// ---------------------------------------------------------------

export const ChatMessageUnionSchema = z.discriminatedUnion('type', [
  ChatMessageSchema,
  ChatMeSchema,
  ChatSystemMessageSchema,
  ChatErrorSchema,
  ChatGameEventSchema,
]);

export type ChatMessageUnion = z.infer<typeof ChatMessageUnionSchema>;

export const ChatHistorySchema = z.array(ChatMessageUnionSchema);
export type ChatHistoryType = z.infer<typeof ChatHistorySchema>;
