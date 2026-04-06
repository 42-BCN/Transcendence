import { z } from 'zod';

import { VALIDATION as V } from '../http/validation';
import { safeParseSchema } from '../lib';

function normalizeEmailValue(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeUsernameValue(username: string): string {
  return username.trim();
}

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: V.REQUIRED })
  .email({ message: V.INVALID_EMAIL })
  .transform(normalizeEmailValue);

export function normalizeEmail(email: string): string {
  return normalizeEmailValue(email);
}

export const usernameSchema = z
  .string()
  .trim()
  .min(1, { message: V.REQUIRED })
  .max(254, { message: V.FIELD_TOO_LONG })
  .transform(normalizeUsernameValue);

export const identifierSchema = z
  .string()
  .superRefine((val, ctx) => {
    if (val.includes('@')) {
      safeParseSchema(emailSchema, val, ctx);
    } else {
      safeParseSchema(usernameSchema, val, ctx);
    }
  })
  .transform((val) => (val.includes('@') ? normalizeEmailValue(val) : normalizeUsernameValue(val)));

export const passwordSchema = z
  .string()
  .min(8, { message: V.FIELD_TOO_SHORT })
  .max(128, { message: V.FIELD_TOO_LONG })
  .refine((val) => /[A-Za-z]/.test(val), {
    message: V.INVALID_FORMAT,
  })
  .refine((val) => /\d/.test(val), {
    message: V.INVALID_FORMAT,
  });

export const LoginReqSchema = z
  .object({
    identifier: identifierSchema,
    password: z.string().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type LoginReq = z.infer<typeof LoginReqSchema>;

export const SignupReqSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export type SignupReq = z.infer<typeof SignupReqSchema>;

export const ResendVerificationReqSchema = z
  .object({
    email: emailSchema.optional(),
  })
  .strict();

export type ResendVerificationReq = z.infer<typeof ResendVerificationReqSchema>;

export const VerifyEmailReqSchema = z
  .object({
    token: z.string().trim().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type VerifyEmailReq = z.infer<typeof VerifyEmailReqSchema>;

export const ResetPasswordReqSchema = z
  .object({
    token: z.string().trim().min(1, { message: V.REQUIRED }),
    password: passwordSchema,
  })
  .strict();

export type ResetPasswordReq = z.infer<typeof ResetPasswordReqSchema>;
