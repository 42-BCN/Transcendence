"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverReqSchema = exports.ChangePasswordReqSchema = exports.ResetPasswordReqSchema = exports.VerifyEmailReqSchema = exports.ResendVerificationReqSchema = exports.SignupReqSchema = exports.GameRoomJoinSchema = exports.LoginReqSchema = exports.passwordSchema = exports.identifierSchema = exports.usernameSchema = exports.emailSchema = void 0;
exports.normalizeEmail = normalizeEmail;
const zod_1 = require("zod");
const validation_1 = require("../http/validation");
const lib_1 = require("../lib");
function normalizeEmailValue(email) {
    return email.trim().toLowerCase();
}
function normalizeUsernameValue(username) {
    return username.trim();
}
exports.emailSchema = zod_1.z
    .string()
    .trim()
    .min(1, { message: validation_1.VALIDATION.REQUIRED })
    .email({ message: validation_1.VALIDATION.INVALID_EMAIL })
    .transform(normalizeEmailValue);
function normalizeEmail(email) {
    return normalizeEmailValue(email);
}
exports.usernameSchema = zod_1.z
    .string()
    .trim()
    .min(4, { message: validation_1.VALIDATION.FIELD_TOO_SHORT })
    .max(15, { message: validation_1.VALIDATION.FIELD_TOO_LONG })
    .regex(/^[a-zA-Z0-9]+$/, { message: validation_1.VALIDATION.INVALID_FORMAT })
    .transform(normalizeUsernameValue);
exports.identifierSchema = zod_1.z
    .string()
    .superRefine((val, ctx) => {
    if (val.includes('@')) {
        (0, lib_1.safeParseSchema)(exports.emailSchema, val, ctx);
    }
    else {
        (0, lib_1.safeParseSchema)(exports.usernameSchema, val, ctx);
    }
})
    .transform((val) => (val.includes('@') ? normalizeEmailValue(val) : normalizeUsernameValue(val)));
exports.passwordSchema = zod_1.z
    .string()
    .min(8, { message: validation_1.VALIDATION.FIELD_TOO_SHORT })
    .max(128, { message: validation_1.VALIDATION.FIELD_TOO_LONG })
    .refine((val) => /[A-Za-z]/.test(val), {
    message: validation_1.VALIDATION.INVALID_FORMAT,
})
    .refine((val) => /\d/.test(val), {
    message: validation_1.VALIDATION.INVALID_FORMAT,
});
exports.LoginReqSchema = zod_1.z
    .object({
    identifier: exports.identifierSchema,
    password: zod_1.z.string().min(1, { message: validation_1.VALIDATION.REQUIRED }),
})
    .strict();
//	my stuff
exports.GameRoomJoinSchema = zod_1.z
    .object({
    gameRoomId: zod_1.z
        .string()
        .trim()
        .regex(/\d+/)
        .transform((val) => val.trim()),
})
    .strict();
// my stuff
exports.SignupReqSchema = zod_1.z
    .object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
})
    .strict();
exports.ResendVerificationReqSchema = zod_1.z
    .object({
    email: exports.emailSchema.optional(),
})
    .strict();
exports.VerifyEmailReqSchema = zod_1.z
    .object({
    token: zod_1.z.string().trim().min(1, { message: validation_1.VALIDATION.REQUIRED }),
})
    .strict();
exports.ResetPasswordReqSchema = zod_1.z
    .object({
    token: zod_1.z.string().trim().min(1, { message: validation_1.VALIDATION.REQUIRED }),
    password: exports.passwordSchema,
})
    .strict();
exports.ChangePasswordReqSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, { message: validation_1.VALIDATION.REQUIRED }),
    newPassword: exports.passwordSchema,
})
    .strict();
exports.RecoverReqSchema = zod_1.z
    .object({
    identifier: exports.identifierSchema.transform((val) => val.includes('@') ? val.toLowerCase().trim() : val),
})
    .strict();
