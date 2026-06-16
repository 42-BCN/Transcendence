import { z } from 'zod';
import { DirectMessageGameInvitationSchema } from '../direct-messages/direct-messages.schema';

export const friendshipSocketEvents = {
  request: 'friends:request',
  accepted: 'friends:accepted',
  rejected: 'friends:rejected',
} as const;

export const directMessageUnreadSocketEvents = {
  updated: 'dm:unread-updated',
} as const;

export const gameInvitationSocketEvents = {
  updated: 'game:invitations:updated',
  received: 'game:invitations:received',
} as const;

export const presenceSocketEvents = {
  online: 'user:online',
  away: 'user:away',
  offline: 'user:offline',
  active: 'user:active',
} as const;

export type FriendshipSocketEvent =
  (typeof friendshipSocketEvents)[keyof typeof friendshipSocketEvents];

export type DirectMessageUnreadSocketEvent =
  (typeof directMessageUnreadSocketEvents)[keyof typeof directMessageUnreadSocketEvents];

export type GameInvitationSocketEvent =
  (typeof gameInvitationSocketEvents)[keyof typeof gameInvitationSocketEvents];

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

export const DirectMessageUnreadUpdatedPayloadSchema = z.strictObject({
  otherUserId: z.string().uuid(),
  unreadMessageCount: z.number().int().nonnegative(),
});

export type DirectMessageUnreadUpdatedPayload = z.infer<
  typeof DirectMessageUnreadUpdatedPayloadSchema
>;

export const friendshipSocketPayloadSchemas = {
  [friendshipSocketEvents.request]: FriendRequestNotificationPayloadSchema,
  [friendshipSocketEvents.accepted]: FriendAcceptedNotificationPayloadSchema,
  [friendshipSocketEvents.rejected]: FriendRejectedNotificationPayloadSchema,
} as const satisfies Record<FriendshipSocketEvent, z.ZodTypeAny>;

export const directMessageUnreadSocketPayloadSchemas = {
  [directMessageUnreadSocketEvents.updated]: DirectMessageUnreadUpdatedPayloadSchema,
} as const satisfies Record<DirectMessageUnreadSocketEvent, z.ZodTypeAny>;

export const GameInvitationUpdatedPayloadSchema = z.strictObject({
  activeInvitationCount: z.number().int().nonnegative(),
  activeInvitationIds: z.array(z.string().uuid()),
});

export type GameInvitationUpdatedPayload = z.infer<typeof GameInvitationUpdatedPayloadSchema>;

export const gameInvitationSocketPayloadSchemas = {
  [gameInvitationSocketEvents.updated]: GameInvitationUpdatedPayloadSchema,
  [gameInvitationSocketEvents.received]: z.strictObject({
    friendUserId: z.string().uuid(),
    message: DirectMessageGameInvitationSchema,
  }),
} as const satisfies Record<GameInvitationSocketEvent, z.ZodTypeAny>;

export type GameInvitationReceivedPayload = z.infer<
  (typeof gameInvitationSocketPayloadSchemas)[typeof gameInvitationSocketEvents.received]
>;

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

type FriendshipEventHandlers = {
  [K in FriendshipSocketEvent]: (payload: FriendshipSocketPayloadByEvent[K]) => void;
};

type DirectMessageUnreadEventHandlers = Record<
  DirectMessageUnreadSocketEvent,
  (payload: DirectMessageUnreadUpdatedPayload) => void
>;

type GameInvitationEventHandlers = Record<
  typeof gameInvitationSocketEvents.updated,
  (payload: GameInvitationUpdatedPayload) => void
> &
  Record<
    typeof gameInvitationSocketEvents.received,
    (payload: GameInvitationReceivedPayload) => void
  >;

type PresenceEventHandlers = {
  'user:online': (payload: PresenceOnlinePayload) => void;
  'user:away': (payload: PresenceAwayPayload) => void;
  'user:offline': (payload: PresenceOfflinePayload) => void;
};

export type ServerToClientFriendshipEvents = FriendshipEventHandlers &
  DirectMessageUnreadEventHandlers &
  GameInvitationEventHandlers &
  PresenceEventHandlers;

// ---------------------------------------------------------------------------
// Client -> Server events (presence signals)
// ---------------------------------------------------------------------------

export type ClientToServerFriendshipEvents = {
  'user:away': () => void;
  'user:active': () => void;
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

const GameInvitationUpdatedNotifyBodySchema = z.strictObject({
  event: z.literal(gameInvitationSocketEvents.updated),
  userId: friendshipSocketUserIdSchema,
  payload: GameInvitationUpdatedPayloadSchema,
});

const GameInvitationReceivedNotifyBodySchema = z.strictObject({
  event: z.literal(gameInvitationSocketEvents.received),
  userId: friendshipSocketUserIdSchema,
  payload: gameInvitationSocketPayloadSchemas[gameInvitationSocketEvents.received],
});

export const FriendshipInternalNotifyBodySchema = z.discriminatedUnion('event', [
  FriendRequestNotifyBodySchema,
  FriendAcceptedNotifyBodySchema,
  FriendRejectedNotifyBodySchema,
  GameInvitationUpdatedNotifyBodySchema,
  GameInvitationReceivedNotifyBodySchema,
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
