import { z } from 'zod';

function addZodIssuesToCtx(ctx: z.RefinementCtx, issues: z.ZodIssue[]) {
  for (const issue of issues) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: issue.message,
    });
  }
}

export function safeParseSchema<T>(
  schema: z.ZodType<T>,
  value: unknown,
  ctx: z.RefinementCtx,
): boolean {
  const res = schema.safeParse(value);
  if (!res.success) addZodIssuesToCtx(ctx, res.error.issues);
  return res.success;
}
