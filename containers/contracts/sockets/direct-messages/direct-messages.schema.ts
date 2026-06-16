import { z } from 'zod';

import { VALIDATION } from '../../api/http/validation';

export const directMessageSocketEvents = {
  send: 'dm:send',
  message: 'dm:message',
  history: 'dm:history',
  read: 'dm:read',
  error: 'dm:error',
} as const;

export const directMessageFriendUserIdSchema = z.string().uuid();

export const DirectMessageSendSchema = z.strictObject({
  clientMessageId: z.string().uuid(),
  text: z
    .string()
    .trim()
    .min(1, { message: VALIDATION.REQUIRED })
    .max(300, { message: VALIDATION.FIELD_TOO_LONG })
    .transform((value: string) => value.trim()),
});

export type DirectMessageSend = z.infer<typeof DirectMessageSendSchema>;

export const DirectMessageThreadBodySchema = z.strictObject({
  currentUserId: z.string().uuid(),
  friendUserId: z.string().uuid(),
});

export type DirectMessageThreadBody = z.infer<typeof DirectMessageThreadBodySchema>;

export const DirectMessageSendBodySchema = z.strictObject({
  currentUserId: z.string().uuid(),
  friendUserId: z.string().uuid(),
  text: DirectMessageSendSchema.shape.text,
});

export type DirectMessageSendBody = z.infer<typeof DirectMessageSendBodySchema>;

const DirectMessageBaseSchema = z.strictObject({
  clientMessageId: z.string().uuid().optional(),
  id: z.string().uuid(),
  createdAt: z.number(),
  senderId: z.string().uuid(),
  username: z.string().min(1),
  readAt: z.number().nullable(),
});

export const DirectMessageReadSchema = z.strictObject({
  friendUserId: z.string().uuid(),
  unreadCount: z.number().int().nonnegative(),
});

export type DirectMessageRead = z.infer<typeof DirectMessageReadSchema>;

export const DirectMessageUserSchema = DirectMessageBaseSchema.extend({
  type: z.literal('user'),
  content: z.strictObject({
    text: z.string(),
  }),
});

export const DirectMessageGameInvitationSchema = DirectMessageBaseSchema.extend({
  type: z.literal('game_invitation'),
  content: z.strictObject({
    invitationId: z.string().uuid(),
    roomId: z.string(),
    inviterId: z.string().uuid(),
    invitedUserId: z.string().uuid(),
    inviterUsername: z.string().min(1),
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    acceptedAt: z.string().datetime().nullable().optional(),
  }),
});

export const DirectMessageSchema = z.discriminatedUnion('type', [
  DirectMessageUserSchema,
  DirectMessageGameInvitationSchema,
]);

export type DirectMessage = z.infer<typeof DirectMessageSchema>;

export const DirectMessageHistorySchema = z.array(DirectMessageSchema);
export type DirectMessageHistory = z.infer<typeof DirectMessageHistorySchema>;

export const DirectMessageErrorSchema = DirectMessageBaseSchema.extend({
  type: z.literal('error'),
  content: z.strictObject({
    text: z.literal('INVALID_DIRECT_MESSAGE'),
  }),
});

export type DirectMessageError = z.infer<typeof DirectMessageErrorSchema>;

export type ClientToServerDirectMessageEvents = {
  [directMessageSocketEvents.send]: (payload: DirectMessageSend) => void;
  [directMessageSocketEvents.read]: () => void;
};

export type ServerToClientDirectMessageEvents = {
  [directMessageSocketEvents.message]: (payload: DirectMessage) => void;
  [directMessageSocketEvents.history]: (payload: DirectMessageHistory) => void;
  [directMessageSocketEvents.read]: (payload: DirectMessageRead) => void;
  [directMessageSocketEvents.error]: (payload: DirectMessageError) => void;
};
