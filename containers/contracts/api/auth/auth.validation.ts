import { z } from 'zod';

import { VALIDATION as V } from '../http/validation';
import { safeParseSchema } from '../lib';

export const emailSchema = z
  .email({ message: V.INVALID_EMAIL })
  .transform((val) => val.toLowerCase().trim());

export const usernameSchema = z
  .string()
  .trim()
  .min(1, { message: V.REQUIRED })
  .max(254, { message: V.FIELD_TOO_LONG });

export const identifierSchema = z.string().superRefine((val, ctx) => {
  if (val.includes('@')) {
    safeParseSchema(emailSchema, val, ctx);
  } else {
    safeParseSchema(usernameSchema, val, ctx);
  }
});

export const LoginReqSchema = z
  .object({
    identifier: identifierSchema.transform((val) =>
      val.includes('@') ? val.toLowerCase().trim() : val,
    ),
    password: z.string().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type LoginReq = z.infer<typeof LoginReqSchema>;

export const SignupReqSchema = z
  .object({
    email: emailSchema.transform((val) => val.toLowerCase().trim()),
    password: z.string().min(1, { message: V.REQUIRED }),
    privacy: z.boolean().refine((val) => val === true, { message: V.REQUIRED }),
  })
  .strict();

export type SignupReq = z.infer<typeof SignupReqSchema>;
