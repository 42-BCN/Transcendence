import type { Request, Response, NextFunction } from "express";
import type { ZodType, infer as ZodInfer, z } from "zod";

import {
  type ValidationErrorDetails,
  type ValidationCode,
  VALIDATION_ERROR,
} from "../contracts/api/http/validation";
import { VALIDATION } from "../contracts/api/http/validation";

/**
 * Converts Zod issues into your { fields: { [path]: ValidationCode[] } } shape.
 * - Uses issue.message as ValidationCode (because you already set message: VALIDATION.* in schemas)
 * - Falls back to VALIDATION.INVALID_FORMAT if it’s not one of your codes
 */
function toValidationDetails(error: z.ZodError): ValidationErrorDetails {
  const fields: Record<string, ValidationCode[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "_";
    const msg = issue.message;

    const code: ValidationCode = (
      Object.values(VALIDATION) as string[]
    ).includes(msg)
      ? (msg as ValidationCode)
      : VALIDATION.INVALID_FORMAT;

    (fields[path] ??= []).push(code);
  }

  return { fields };
}

export function parseBodyOrSendValidationError<
  TSchema extends ZodType<unknown>,
>(schema: TSchema, req: Request, res: Response): ZodInfer<TSchema> | null {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    res.status(VALIDATION_ERROR.status).json({
      ok: false,
      error: {
        code: VALIDATION_ERROR.code,
        details: toValidationDetails(parsed.error),
      },
    });

    return null;
  }

  return parsed.data;
}

export function validateBody<TSchema extends ZodType<unknown>>(
  schema: TSchema,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      res.status(VALIDATION_ERROR.status).json({
        ok: false,
        error: {
          code: VALIDATION_ERROR.code,
          details: toValidationDetails(parsed.error),
        },
      });
      return;
    }

    // keep body as validated data
    req.body = parsed.data as ZodInfer<TSchema>;
    next();
  };
}
