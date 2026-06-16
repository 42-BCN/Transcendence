"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptGameInvitationBodySchema = exports.SendGameInvitationBodySchema = void 0;
const zod_1 = require("zod");
exports.SendGameInvitationBodySchema = zod_1.z.strictObject({
    friendUserId: zod_1.z.string().uuid(),
});
exports.AcceptGameInvitationBodySchema = zod_1.z.strictObject({
    invitationId: zod_1.z.string().uuid(),
});
