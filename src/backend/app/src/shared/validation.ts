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

    req.body = parsed.data as ZodInfer<TSchema>;
    next();
  };
}

export function validateQuery<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
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
    res.locals.query = parsed.data;
    next();
  };
}

export function validateParams<T>(schema: z.ZodType<T>) {
  return (req: Request<T>, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      res.status(VALIDATION_ERROR.status).json({
        ok: false,
        error: {
          code: VALIDATION_ERROR.code,
          details: toValidationDetails(parsed.error),
        },
      });
    }

    req.params = parsed.data as any;
    next();
  };
}
