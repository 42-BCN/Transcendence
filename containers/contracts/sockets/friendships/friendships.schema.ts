import { z } from 'zod';

export const friendshipSocketEvents = {
  request: 'friends:request',
  accepted: 'friends:accepted',
  rejected: 'friends:rejected',
} as const;

export const presenceSocketEvents = {
  online: 'user:online',
  away: 'user:away',
  offline: 'user:offline',
  active: 'user:active',
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

// ---------------------------------------------------------------------------
// Presence schemas
// ---------------------------------------------------------------------------

export const PresenceOnlinePayloadSchema = z.strictObject({
  userId: z.string().uuid(),
  username: z.string().min(1),
});

export type PresenceOnlinePayload = z.infer<typeof PresenceOnlinePayloadSchema>;

export const PresenceAwayPayloadSchema = z.strictObject({
  userId: z.string().uuid(),
});

export type PresenceAwayPayload = z.infer<typeof PresenceAwayPayloadSchema>;

export const PresenceOfflinePayloadSchema = z.strictObject({
  userId: z.string().uuid(),
});

export type PresenceOfflinePayload = z.infer<typeof PresenceOfflinePayloadSchema>;

// ---------------------------------------------------------------------------
// Server -> Client events (friendship notifications + presence)
// ---------------------------------------------------------------------------

export type ServerToClientFriendshipEvents = {
  [K in FriendshipSocketEvent]: (payload: FriendshipSocketPayloadByEvent[K]) => void;
} & {
  [presenceSocketEvents.online]: (payload: PresenceOnlinePayload) => void;
  [presenceSocketEvents.away]: (payload: PresenceAwayPayload) => void;
  [presenceSocketEvents.offline]: (payload: PresenceOfflinePayload) => void;
};

// ---------------------------------------------------------------------------
// Client -> Server events (presence signals)
// ---------------------------------------------------------------------------

export type ClientToServerFriendshipEvents = {
  [presenceSocketEvents.away]: () => void;
  [presenceSocketEvents.active]: () => void;
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

export const FriendshipFriendsListBodySchema = z.strictObject({
  userId: friendshipSocketUserIdSchema,
});

export type FriendshipFriendsListBody = z.infer<typeof FriendshipFriendsListBodySchema>;
