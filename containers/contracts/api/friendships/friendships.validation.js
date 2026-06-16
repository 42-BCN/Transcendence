"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFriendshipParamSchema = exports.RespondFriendRequestBodySchema = exports.SendFriendRequestBodySchema = void 0;
const zod_1 = require("zod");
exports.SendFriendRequestBodySchema = zod_1.z.object({
    targetUserId: zod_1.z.string().uuid(),
});
exports.RespondFriendRequestBodySchema = zod_1.z.object({
    friendshipId: zod_1.z.string().uuid(),
    action: zod_1.z.enum(['accept', 'reject']),
});
exports.DeleteFriendshipParamSchema = zod_1.z.strictObject({
    friendshipId: zod_1.z.string().uuid(),
});
