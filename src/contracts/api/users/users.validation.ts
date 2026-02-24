import { z } from "zod";

import { VALIDATION } from "../http/validation"; // your codes

const intFromQuery = (code: string) =>
  z
    .string()
    .trim()
    .min(1, { message: code })
    .regex(/^\d+$/, { message: code })
    .transform((v) => Number(v));

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

export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;
