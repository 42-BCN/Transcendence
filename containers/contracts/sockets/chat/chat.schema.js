"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistorySchema = exports.ChatMessageUnionSchema = exports.ChatIdentitySchema = exports.ChatGameEventSchema = exports.ChatErrorSchema = exports.CHAT_ERRORS = exports.ChatSystemMessageSchema = exports.ChatMeSchema = exports.ChatMessageSchema = exports.ChatSendSchema = exports.MessageTimestampSchema = exports.MessageIdSchema = exports.GameEventPayloadSchema = void 0;
var zod_1 = require("zod");
var validation_1 = require("../../api/http/validation");
exports.GameEventPayloadSchema = zod_1.z.object({
    name: zod_1.z.string(),
    payload: zod_1.z.unknown(),
});
// ---------------------------------------------------------------
// shared
// ---------------------------------------------------------------
exports.MessageIdSchema = zod_1.z.string();
exports.MessageTimestampSchema = zod_1.z.number();
var BaseMessageSchema = zod_1.z.object({
    id: exports.MessageIdSchema,
    createdAt: exports.MessageTimestampSchema,
    username: zod_1.z.string().optional(),
});
var TextContentSchema = zod_1.z.object({
    text: zod_1.z.string(),
});
// ---------------------------------------------------------------
// client -> server
// ---------------------------------------------------------------
exports.ChatSendSchema = zod_1.z.object({
    text: zod_1.z
        .string()
        .trim()
        .min(1, { message: validation_1.VALIDATION.REQUIRED })
        .max(300, { message: validation_1.VALIDATION.FIELD_TOO_LONG })
        .transform(function (val) { return val.trim(); }),
});
// ---------------------------------------------------------------
// server -> client
// ---------------------------------------------------------------
exports.ChatMessageSchema = BaseMessageSchema.extend({
    type: zod_1.z.literal('user'),
    username: zod_1.z.string(),
    content: TextContentSchema,
});
exports.ChatMeSchema = BaseMessageSchema.extend({
    type: zod_1.z.literal('me'),
    username: zod_1.z.string(),
    content: TextContentSchema,
});
exports.ChatSystemMessageSchema = BaseMessageSchema.extend({
    type: zod_1.z.literal('system'),
    content: zod_1.z.object({
        text: zod_1.z.enum(['USER_JOINED', 'USER_LEFT']),
    }),
});
// ---------------------------------------------------------------
// error
// ---------------------------------------------------------------
exports.CHAT_ERRORS = ['INVALID_CHAT_MESSAGE'];
exports.ChatErrorSchema = BaseMessageSchema.extend({
    type: zod_1.z.literal('error'),
    content: zod_1.z.object({
        text: zod_1.z.enum(exports.CHAT_ERRORS),
    }),
});
exports.ChatGameEventSchema = BaseMessageSchema.extend({
    type: zod_1.z.literal('game-event'),
    content: zod_1.z.object({
        text: zod_1.z.string(),
        payload: zod_1.z.unknown(),
    }),
});
exports.ChatIdentitySchema = zod_1.z.object({
    identityKey: zod_1.z.string(),
    username: zod_1.z.string(),
    isGuest: zod_1.z.boolean(),
    userId: zod_1.z.string().optional(),
});
// ---------------------------------------------------------------
// union
// ---------------------------------------------------------------
exports.ChatMessageUnionSchema = zod_1.z.discriminatedUnion('type', [
    exports.ChatMessageSchema,
    exports.ChatMeSchema,
    exports.ChatSystemMessageSchema,
    exports.ChatErrorSchema,
    exports.ChatGameEventSchema,
]);
exports.ChatHistorySchema = zod_1.z.array(exports.ChatMessageUnionSchema);
//# sourceMappingURL=chat.schema.js.map