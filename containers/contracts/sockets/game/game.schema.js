"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlanPayloadSchema = exports.GameEventMapInfo = void 0;
var zod_1 = require("zod");
exports.GameEventMapInfo = zod_1.z.object({
    id: zod_1.z.string(),
    payload: zod_1.z.unknown(),
});
exports.UpdatePlanPayloadSchema = zod_1.z.object({
    id: zod_1.z.string(),
    payload: zod_1.z.unknown(),
});
//# sourceMappingURL=game.schema.js.map