import { z } from 'zod';
import { VALIDATION } from '../http/validation';

export const identifierSchema = z.string().superRefine((val, ctx) => {
  if (!val || val.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: VALIDATION.REQUIRED,
    });
    return;
  }

  if (val.includes('@')) {
    const emailValid = z.string().email().safeParse(val).success;
    if (!emailValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION.INVALID_EMAIL,
      });
    }
    return;
  }

  // Otherwise validate as username
  if (val.length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: VALIDATION.FIELD_TOO_SHORT,
    });
  }

  if (val.length > 30) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: VALIDATION.FIELD_TOO_LONG,
    });
  }

  const usernameRegex = /^\w+$/;

  if (!usernameRegex.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: VALIDATION.INVALID_USERNAME,
    });
  }
});

export const AuthLoginRequestSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(1, { message: VALIDATION.REQUIRED }),
});
