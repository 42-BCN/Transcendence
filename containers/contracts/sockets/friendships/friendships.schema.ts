import { z } from 'zod';

export const friendshipSocketEvents = {
  request: 'friends:request',
  accepted: 'friends:accepted',
  rejected: 'friends:rejected',
} as const;

export type FriendshipSocketEvent =
  (typeof friendshipSocketEvents)[keyof typeof friendshipSocketEvents];

export const friendshipSocketUserIdSchema = z.string().uuid();

export const FriendRequestNotificationPayloadSchema = z.strictObject({
  senderId: z.string().uuid(),
  senderUsername: z.string().min(1),
  friendshipId: z.string().uuid(),
});

export type FriendRequestNotificationPayload = z.infer<
  typeof FriendRequestNotificationPayloadSchema
>;

export const FriendAcceptedNotificationPayloadSchema = z.strictObject({
  friendUserId: z.string().uuid(),
  friendUsername: z.string().min(1),
});

export type FriendAcceptedNotificationPayload = z.infer<
  typeof FriendAcceptedNotificationPayloadSchema
>;

export const FriendRejectedNotificationPayloadSchema = z.strictObject({
  rejectedByUserId: z.string().uuid(),
  friendshipId: z.string().uuid(),
});

export type FriendRejectedNotificationPayload = z.infer<
  typeof FriendRejectedNotificationPayloadSchema
>;

export const friendshipSocketPayloadSchemas = {
  [friendshipSocketEvents.request]: FriendRequestNotificationPayloadSchema,
  [friendshipSocketEvents.accepted]: FriendAcceptedNotificationPayloadSchema,
  [friendshipSocketEvents.rejected]: FriendRejectedNotificationPayloadSchema,
} as const satisfies Record<FriendshipSocketEvent, z.ZodTypeAny>;

export type FriendshipSocketPayloadByEvent = {
  [K in keyof typeof friendshipSocketPayloadSchemas]: z.infer<
    (typeof friendshipSocketPayloadSchemas)[K]
  >;
};

export type ServerToClientFriendshipEvents = {
  [K in FriendshipSocketEvent]: (payload: FriendshipSocketPayloadByEvent[K]) => void;
};

const FriendRequestNotifyBodySchema = z.strictObject({
  event: z.literal(friendshipSocketEvents.request),
  userId: friendshipSocketUserIdSchema,
  payload: FriendRequestNotificationPayloadSchema,
});

const FriendAcceptedNotifyBodySchema = z.strictObject({
  event: z.literal(friendshipSocketEvents.accepted),
  userId: friendshipSocketUserIdSchema,
  payload: FriendAcceptedNotificationPayloadSchema,
});

const FriendRejectedNotifyBodySchema = z.strictObject({
  event: z.literal(friendshipSocketEvents.rejected),
  userId: friendshipSocketUserIdSchema,
  payload: FriendRejectedNotificationPayloadSchema,
});

export const FriendshipInternalNotifyBodySchema = z.discriminatedUnion('event', [
  FriendRequestNotifyBodySchema,
  FriendAcceptedNotifyBodySchema,
  FriendRejectedNotifyBodySchema,
]);

export type FriendshipInternalNotifyBody = z.infer<typeof FriendshipInternalNotifyBodySchema>;

export const FriendshipPresenceCheckBodySchema = z.strictObject({
  userIds: z.array(friendshipSocketUserIdSchema),
});

export type FriendshipPresenceCheckBody = z.infer<typeof FriendshipPresenceCheckBodySchema>;
