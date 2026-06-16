"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectMessageErrorSchema = exports.DirectMessageHistorySchema = exports.DirectMessageSchema = exports.DirectMessageGameInvitationSchema = exports.DirectMessageUserSchema = exports.DirectMessageReadSchema = exports.DirectMessageSendBodySchema = exports.DirectMessageThreadBodySchema = exports.DirectMessageSendSchema = exports.directMessageFriendUserIdSchema = exports.directMessageSocketEvents = void 0;
var zod_1 = require("zod");
var validation_1 = require("../../api/http/validation");
exports.directMessageSocketEvents = {
    send: 'dm:send',
    message: 'dm:message',
    history: 'dm:history',
    read: 'dm:read',
    error: 'dm:error',
};
exports.directMessageFriendUserIdSchema = zod_1.z.string().uuid();
exports.DirectMessageSendSchema = zod_1.z.strictObject({
    clientMessageId: zod_1.z.string().uuid(),
    text: zod_1.z
        .string()
        .trim()
        .min(1, { message: validation_1.VALIDATION.REQUIRED })
        .max(300, { message: validation_1.VALIDATION.FIELD_TOO_LONG })
        .transform(function (value) { return value.trim(); }),
});
exports.DirectMessageThreadBodySchema = zod_1.z.strictObject({
    currentUserId: zod_1.z.string().uuid(),
    friendUserId: zod_1.z.string().uuid(),
});
exports.DirectMessageSendBodySchema = zod_1.z.strictObject({
    currentUserId: zod_1.z.string().uuid(),
    friendUserId: zod_1.z.string().uuid(),
    text: exports.DirectMessageSendSchema.shape.text,
});
var DirectMessageBaseSchema = zod_1.z.strictObject({
    clientMessageId: zod_1.z.string().uuid().optional(),
    id: zod_1.z.string().uuid(),
    createdAt: zod_1.z.number(),
    senderId: zod_1.z.string().uuid(),
    username: zod_1.z.string().min(1),
    readAt: zod_1.z.number().nullable(),
});
exports.DirectMessageReadSchema = zod_1.z.strictObject({
    friendUserId: zod_1.z.string().uuid(),
    unreadCount: zod_1.z.number().int().nonnegative(),
});
exports.DirectMessageUserSchema = DirectMessageBaseSchema.extend({
    type: zod_1.z.literal('user'),
    content: zod_1.z.strictObject({
        text: zod_1.z.string(),
    }),
});
exports.DirectMessageGameInvitationSchema = DirectMessageBaseSchema.extend({
    type: zod_1.z.literal('game_invitation'),
    content: zod_1.z.strictObject({
        invitationId: zod_1.z.string().uuid(),
        roomId: zod_1.z.string(),
        inviterId: zod_1.z.string().uuid(),
        invitedUserId: zod_1.z.string().uuid(),
        inviterUsername: zod_1.z.string().min(1),
        createdAt: zod_1.z.string().datetime(),
        expiresAt: zod_1.z.string().datetime(),
        acceptedAt: zod_1.z.string().datetime().nullable().optional(),
    }),
});
exports.DirectMessageSchema = zod_1.z.discriminatedUnion('type', [
    exports.DirectMessageUserSchema,
    exports.DirectMessageGameInvitationSchema,
]);
exports.DirectMessageHistorySchema = zod_1.z.array(exports.DirectMessageSchema);
exports.DirectMessageErrorSchema = DirectMessageBaseSchema.extend({
    type: zod_1.z.literal('error'),
    content: zod_1.z.strictObject({
        text: zod_1.z.literal('INVALID_DIRECT_MESSAGE'),
    }),
});
//# sourceMappingURL=direct-messages.schema.js.map