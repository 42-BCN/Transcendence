import { z } from "zod";

import type { ApiResponse } from "../http/response";
import type { ValidationErrorDetails } from "../http/validation";
import { type AuthErrorName } from "./auth.errors";
import { identifierSchema } from "./auth.validation";

export type RecoverOk = {
  identifier: string;
};

export const AUTH_RECOVER_ERRORS = [
  "AUTH_INTERNAL_ERROR",
  "VALIDATION_ERROR",
] as const satisfies readonly AuthErrorName[];

export type RecoverError = (typeof AUTH_RECOVER_ERRORS)[number];

export type RecoverRes = ApiResponse<
  RecoverOk,
  RecoverError,
  ValidationErrorDetails
>;

export const RecoverReqSchema = z
  .object({
    identifier: identifierSchema.transform((val) =>
      val.includes("@") ? val.toLowerCase().trim() : val
    ),
  })
  .strict();

export type RecoverReq = z.infer<typeof RecoverReqSchema>;
