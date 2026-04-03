import { z } from "zod";

import { VALIDATION as V } from "../http/validation";
import { safeParseSchema } from "../lib";

export const emailSchema = z
  .email({ message: V.INVALID_EMAIL })
  .transform((val) => val.toLowerCase().trim());

export function normalizeEmail(email: string): string {
  return emailSchema.parse(email);
}

export const usernameSchema = z
  .string()
  .trim()
  .min(1, { message: V.REQUIRED })
  .max(254, { message: V.FIELD_TOO_LONG });

export const identifierSchema = z.string().superRefine((val, ctx) => {
  if (val.includes("@")) {
    safeParseSchema(emailSchema, val, ctx);
  } else {
    safeParseSchema(usernameSchema, val, ctx);
  }
});

export const LoginReqSchema = z
  .object({
    identifier: identifierSchema.transform((val) =>
      val.includes("@") ? normalizeEmail(val) : val,
    ),
    password: z.string().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type LoginReq = z.infer<typeof LoginReqSchema>;

export const SignupReqSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type SignupReq = z.infer<typeof SignupReqSchema>;
