import { z } from "zod";

import { VALIDATION as V } from "../http/validation";
import { safeParseSchema } from "../lib";

export const emailSchema = z
  .email({ message: V.INVALID_EMAIL })
  .transform((val) => val.toLowerCase().trim());

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
      val.includes("@") ? val.toLowerCase().trim() : val,
    ),
    password: z.string().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type LoginReq = z.infer<typeof LoginReqSchema>;

export const SignupReqSchema = z
  .object({
    email: emailSchema.transform((val) => val.toLowerCase().trim()),
    password: z.string().min(1, { message: V.REQUIRED }),
  })
  .strict();

export type SignupReq = z.infer<typeof SignupReqSchema>;

export const VerifyQuerySchema = z.strictObject({
  token: z.string().min(1, { message: V.REQUIRED }),
});
export type VerifyQuery = z.infer<typeof VerifyQuerySchema>;

export const RecoverReqSchema = z.strictObject({
  identifier: identifierSchema.transform((val) =>
    val.includes("@") ? val.toLowerCase().trim() : val,
  ),
});
export type RecoverReq = z.infer<typeof RecoverReqSchema>;

export const RecoverParamSchema = z.strictObject({
  token: z.string().min(1, { message: V.REQUIRED }),
});
export type RecoverParam = z.infer<typeof RecoverParamSchema>;

export const RecoverUpdateSchema = z.strictObject({
  token: z.string().min(1, { message: V.REQUIRED }),
  password: z.string().min(1, { message: V.REQUIRED }),
});
export type RecoverUpdate = z.infer<typeof RecoverUpdateSchema>;

export const FullUserSchema = z.strictObject({
  user: z.string().min(1, { message: V.REQUIRED }),
});
export type FullUser = z.infer<typeof FullUserSchema>;
