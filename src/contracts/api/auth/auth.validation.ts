import { z } from "zod";

import { VALIDATION } from "../http/validation";
import { safeParseSchema } from "../lib";

export const trimRequiredString = z
  .string()
  .trim()
  .min(1, { message: VALIDATION.REQUIRED });

export const emailSchema = trimRequiredString.email({
  message: VALIDATION.INVALID_EMAIL,
});

export const usernameSchema = trimRequiredString
  .min(3, { message: VALIDATION.FIELD_TOO_SHORT })
  .max(30, { message: VALIDATION.FIELD_TOO_LONG })
  .regex(/^[\w-]+$/, { message: VALIDATION.INVALID_USERNAME });

export const identifierSchema = trimRequiredString.superRefine((val, ctx) =>
  val.includes("@")
    ? safeParseSchema(emailSchema, val, ctx)
    : safeParseSchema(usernameSchema, val, ctx),
);

export const AuthLoginRequestSchema = z
  .object({
    identifier: identifierSchema,
    password: z.string().min(1, { message: VALIDATION.REQUIRED }),
  })
  .strict();

export type AuthLoginRequest = z.infer<typeof AuthLoginRequestSchema>;

export const AuthSignupRequestSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, { message: VALIDATION.REQUIRED }),
  })
  .strict();

export type AuthSignupRequest = z.infer<typeof AuthSignupRequestSchema>;
