import { z } from "zod";

import { VALIDATION } from "../http/validation";
import { usernameSchema } from "../auth/auth.validation";

const firstQueryValue = (v: unknown) => {
  if (Array.isArray(v)) return v[0];
  return v;
};

const intFromQuery = (code: string) =>
  z.preprocess(
    firstQueryValue,
    z
      .string()
      .trim()
      .min(1, { message: code })
      .regex(/^\d+$/, { message: code })
      .transform((v) => Number(v)),
  );

export const GetUsersQuerySchema = z
  .object({
    limit: intFromQuery(VALIDATION.INVALID_FORMAT).optional(),
    offset: intFromQuery(VALIDATION.INVALID_FORMAT).optional(),
  })
  .strict()
  .transform((q) => ({
    limit: q.limit ?? 20,
    offset: q.offset ?? 0,
  }))
  .refine((q) => q.limit >= 1 && q.limit <= 100, {
    message: VALIDATION.OUT_OF_RANGE,
    path: ["limit"],
  })
  .refine((q) => q.offset >= 0, {
    message: VALIDATION.OUT_OF_RANGE,
    path: ["offset"],
  });

export const  GetUserByIdParamSchema = z.strictObject({ userId: usernameSchema});

export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;
export type getUserByUnameQuery =  z.infer<typeof GetUserByIdParamSchema>;
