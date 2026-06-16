"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipFriendsListBodySchema = exports.FriendshipPresenceCheckBodySchema = exports.FriendshipInternalNotifyBodySchema = exports.PresenceOfflinePayloadSchema = exports.PresenceAwayPayloadSchema = exports.PresenceOnlinePayloadSchema = exports.gameInvitationSocketPayloadSchemas = exports.GameInvitationUpdatedPayloadSchema = exports.directMessageUnreadSocketPayloadSchemas = exports.friendshipSocketPayloadSchemas = exports.DirectMessageUnreadUpdatedPayloadSchema = exports.FriendRejectedNotificationPayloadSchema = exports.FriendAcceptedNotificationPayloadSchema = exports.FriendRequestNotificationPayloadSchema = exports.friendshipSocketUserIdSchema = exports.presenceSocketEvents = exports.gameInvitationSocketEvents = exports.directMessageUnreadSocketEvents = exports.friendshipSocketEvents = void 0;
var zod_1 = require("zod");
var direct_messages_schema_1 = require("../direct-messages/direct-messages.schema");
exports.friendshipSocketEvents = {
    request: 'friends:request',
    accepted: 'friends:accepted',
    rejected: 'friends:rejected',
};
exports.directMessageUnreadSocketEvents = {
    updated: 'dm:unread-updated',
};
exports.gameInvitationSocketEvents = {
    updated: 'game:invitations:updated',
    received: 'game:invitations:received',
};
exports.presenceSocketEvents = {
    online: 'user:online',
    away: 'user:away',
    offline: 'user:offline',
    active: 'user:active',
};
exports.friendshipSocketUserIdSchema = zod_1.z.string().uuid();
exports.FriendRequestNotificationPayloadSchema = zod_1.z.strictObject({
    senderId: zod_1.z.string().uuid(),
    senderUsername: zod_1.z.string().min(1),
    friendshipId: zod_1.z.string().uuid(),
});
exports.FriendAcceptedNotificationPayloadSchema = zod_1.z.strictObject({
    friendUserId: zod_1.z.string().uuid(),
    friendUsername: zod_1.z.string().min(1),
});
exports.FriendRejectedNotificationPayloadSchema = zod_1.z.strictObject({
    rejectedByUserId: zod_1.z.string().uuid(),
    friendshipId: zod_1.z.string().uuid(),
});
exports.DirectMessageUnreadUpdatedPayloadSchema = zod_1.z.strictObject({
    otherUserId: zod_1.z.string().uuid(),
    unreadMessageCount: zod_1.z.number().int().nonnegative(),
});
exports.friendshipSocketPayloadSchemas = (_a = {},
    _a[exports.friendshipSocketEvents.request] = exports.FriendRequestNotificationPayloadSchema,
    _a[exports.friendshipSocketEvents.accepted] = exports.FriendAcceptedNotificationPayloadSchema,
    _a[exports.friendshipSocketEvents.rejected] = exports.FriendRejectedNotificationPayloadSchema,
    _a);
exports.directMessageUnreadSocketPayloadSchemas = (_b = {},
    _b[exports.directMessageUnreadSocketEvents.updated] = exports.DirectMessageUnreadUpdatedPayloadSchema,
    _b);
exports.GameInvitationUpdatedPayloadSchema = zod_1.z.strictObject({
    activeInvitationCount: zod_1.z.number().int().nonnegative(),
    activeInvitationIds: zod_1.z.array(zod_1.z.string().uuid()),
});
exports.gameInvitationSocketPayloadSchemas = (_c = {},
    _c[exports.gameInvitationSocketEvents.updated] = exports.GameInvitationUpdatedPayloadSchema,
    _c[exports.gameInvitationSocketEvents.received] = zod_1.z.strictObject({
        friendUserId: zod_1.z.string().uuid(),
        message: direct_messages_schema_1.DirectMessageGameInvitationSchema,
    }),
    _c);
// ---------------------------------------------------------------------------
// Presence schemas
// ---------------------------------------------------------------------------
exports.PresenceOnlinePayloadSchema = zod_1.z.strictObject({
    userId: zod_1.z.string().uuid(),
    username: zod_1.z.string().min(1),
});
exports.PresenceAwayPayloadSchema = zod_1.z.strictObject({
    userId: zod_1.z.string().uuid(),
});
exports.PresenceOfflinePayloadSchema = zod_1.z.strictObject({
    userId: zod_1.z.string().uuid(),
});
var FriendRequestNotifyBodySchema = zod_1.z.strictObject({
    event: zod_1.z.literal(exports.friendshipSocketEvents.request),
    userId: exports.friendshipSocketUserIdSchema,
    payload: exports.FriendRequestNotificationPayloadSchema,
});
var FriendAcceptedNotifyBodySchema = zod_1.z.strictObject({
    event: zod_1.z.literal(exports.friendshipSocketEvents.accepted),
    userId: exports.friendshipSocketUserIdSchema,
    payload: exports.FriendAcceptedNotificationPayloadSchema,
});
var FriendRejectedNotifyBodySchema = zod_1.z.strictObject({
    event: zod_1.z.literal(exports.friendshipSocketEvents.rejected),
    userId: exports.friendshipSocketUserIdSchema,
    payload: exports.FriendRejectedNotificationPayloadSchema,
});
var GameInvitationUpdatedNotifyBodySchema = zod_1.z.strictObject({
    event: zod_1.z.literal(exports.gameInvitationSocketEvents.updated),
    userId: exports.friendshipSocketUserIdSchema,
    payload: exports.GameInvitationUpdatedPayloadSchema,
});
var GameInvitationReceivedNotifyBodySchema = zod_1.z.strictObject({
    event: zod_1.z.literal(exports.gameInvitationSocketEvents.received),
    userId: exports.friendshipSocketUserIdSchema,
    payload: exports.gameInvitationSocketPayloadSchemas[exports.gameInvitationSocketEvents.received],
});
exports.FriendshipInternalNotifyBodySchema = zod_1.z.discriminatedUnion('event', [
    FriendRequestNotifyBodySchema,
    FriendAcceptedNotifyBodySchema,
    FriendRejectedNotifyBodySchema,
    GameInvitationUpdatedNotifyBodySchema,
    GameInvitationReceivedNotifyBodySchema,
]);
exports.FriendshipPresenceCheckBodySchema = zod_1.z.strictObject({
    userIds: zod_1.z.array(exports.friendshipSocketUserIdSchema),
});
exports.FriendshipFriendsListBodySchema = zod_1.z.strictObject({
    userId: exports.friendshipSocketUserIdSchema,
});
//# sourceMappingURL=friendships.schema.js.map