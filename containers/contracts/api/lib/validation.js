"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParseSchema = safeParseSchema;
function addZodIssuesToCtx(ctx, issues) {
    for (const issue of issues) {
        ctx.addIssue({
            code: 'custom',
            message: issue.message,
            path: issue.path,
        });
    }
}
function safeParseSchema(schema, value, ctx) {
    const res = schema.safeParse(value);
    if (!res.success)
        addZodIssuesToCtx(ctx, res.error.issues);
    return res.success;
}
