"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMeProfileReqSchema = exports.SearchUsersQuerySchema = exports.GetUserByIdParamSchema = exports.GetUsersQuerySchema = void 0;
const zod_1 = require("zod");
const validation_1 = require("../http/validation");
const firstQueryValue = (v) => {
    if (Array.isArray(v))
        return v[0];
    return v;
};
const intFromQuery = (code) => zod_1.z.preprocess(firstQueryValue, zod_1.z
    .string()
    .trim()
    .min(1, { message: code })
    .regex(/^\d+$/, { message: code })
    .transform((v) => Number(v)));
exports.GetUsersQuerySchema = zod_1.z
    .object({
    limit: intFromQuery(validation_1.VALIDATION.INVALID_FORMAT).optional(),
    offset: intFromQuery(validation_1.VALIDATION.INVALID_FORMAT).optional(),
})
    .strict()
    .transform((q) => ({
    limit: q.limit ?? 20,
    offset: q.offset ?? 0,
}))
    .refine((q) => q.limit >= 1 && q.limit <= 100, {
    message: validation_1.VALIDATION.OUT_OF_RANGE,
    path: ['limit'],
})
    .refine((q) => q.offset >= 0, {
    message: validation_1.VALIDATION.OUT_OF_RANGE,
    path: ['offset'],
});
exports.GetUserByIdParamSchema = zod_1.z.strictObject({
    userId: zod_1.z.uuid({ message: validation_1.VALIDATION.INVALID_FORMAT }),
});
exports.SearchUsersQuerySchema = zod_1.z
    .object({
    q: zod_1.z
        .string()
        .trim()
        .min(1, { message: validation_1.VALIDATION.REQUIRED })
        .max(100, { message: validation_1.VALIDATION.FIELD_TOO_LONG }),
    limit: intFromQuery(validation_1.VALIDATION.INVALID_FORMAT).optional(),
})
    .strict()
    .transform((q) => ({
    q: q.q,
    limit: q.limit ?? 20,
}))
    .refine((q) => q.limit >= 1 && q.limit <= 20, {
    message: validation_1.VALIDATION.OUT_OF_RANGE,
    path: ['limit'],
});
exports.UpdateMeProfileReqSchema = zod_1.z
    .object({
    bio: zod_1.z.string().trim().max(600, { message: validation_1.VALIDATION.FIELD_TOO_LONG }),
})
    .strict();
