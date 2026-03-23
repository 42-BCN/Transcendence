import { z } from "zod";

import { VALIDATION, type ValidationCode } from "../../api/http/validation";

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
export const ChatMessageSchema = BaseMessageSchema.extend({
  type: z.literal("user"),
  username: z.string(),
  content: TextContentSchema,
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
// ---------------------------------------------------------------- Message Schema end
// ---------------------------------------------------------------- Error Handling start

export const CHAT_ERRORS = ["INVALID_CHAT_MESSAGE"] as const;
type ChatErrorCode = (typeof CHAT_ERRORS)[number];

export const ZodValidationErrorSchema = z.object({
  fieldName: z.array(z.union([z.string(), z.number(), z.symbol()])),
  errCode: z.custom<ValidationCode>(),
});

export type ZodValidationError = z.infer<typeof ZodValidationErrorSchema>;

export const ChatErrorSchema = BaseMessageSchema.extend({
  type: z.literal("error"),
  content: z.object({
    text: z.enum(CHAT_ERRORS),
    details: z.array(ZodValidationErrorSchema),
  }),
});

export type ChatError = z.infer<typeof ChatErrorSchema>;
// ---------------------------------------------------------------- Error Handling end

export const ChatSystemMessageSchema = BaseMessageSchema.extend({
  type: z.literal("system"),
  content: z.object({
    text: z.enum(["USER_JOINED", "USER_LEFT"]),
  }),
});
export type ChatSystemMessage = z.infer<typeof ChatSystemMessageSchema>;

export const ChatMeSchema = BaseMessageSchema.extend({
  type: z.literal("me"),
  username: z.string(),
  content: TextContentSchema,
});
export type ChatMe = z.infer<typeof ChatMeSchema>;

export const ChatMessageUnionSchema = z.discriminatedUnion("type", [
  ChatMessageSchema,
  ChatMeSchema,
  ChatSystemMessageSchema,
  ChatErrorSchema,
]);

export type ChatMessageUnion = z.infer<typeof ChatMessageUnionSchema>;

export const ChatHistorySchema = z.array(ChatMessageUnionSchema);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;

// ---------------------------------------------------------------- Server to Client Schema end
