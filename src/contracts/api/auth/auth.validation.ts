import { z } from "zod";

import { VALIDATION as V } from "../http/validation";
import { safeParseSchema } from "../lib";

// export const trimRequiredString = z
//   .string()
//   .trim()
//   .min(1, { message: V.REQUIRED });

export const emailSchema = z.email({ message: V.INVALID_EMAIL });
// TODO .transform((val) => val.toLowerCase().trim());

export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: V.FIELD_TOO_SHORT })
  .max(30, { message: V.FIELD_TOO_LONG })
  .regex(/^[\w-]+$/, { message: V.INVALID_USERNAME });

export const identifierSchema = z.string().superRefine((val, ctx) => {
  if (val.includes("@")) {
    safeParseSchema(emailSchema, val, ctx);
  } else {
    safeParseSchema(usernameSchema, val, ctx);
  }
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
    password: z.string().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type SignupReq = z.infer<typeof SignupReqSchema>;
