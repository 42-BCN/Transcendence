import type { Request, Response, NextFunction } from "express";
import type { ZodType, infer as ZodInfer, z } from "zod";

import {
  type ValidationErrorDetails,
  type ValidationCode,
  VALIDATION_ERROR,
} from "@contracts/http/validation";
import { VALIDATION } from "@contracts/http/validation";

/**
 * Converts Zod issues into { fields: { [path]: ValidationCode[] } } shape.
 * - Uses issue.message as ValidationCode (set message: VALIDATION.* in schemas)
 * - Falls back to VALIDATION.INVALID_FORMAT if it’s not one of the codes
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

// Maybe this could be error extension throw error to follow the rest of the repo rules
function zodErrRes<TSchema>(
  res: Response,
  parsed: z.ZodSafeParseError<ZodInfer<TSchema>>,
): void {
  res.status(VALIDATION_ERROR.VALIDATION_ERROR).json({
    ok: false,
    error: {
      code: "VALIDATION_ERROR",
      details: toValidationDetails(parsed.error),
    },
  });
}

export function validateBody<TSchema extends ZodType<unknown>>(
  schema: TSchema,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return zodErrRes(res, parsed);
    req.body = parsed.data as ZodInfer<TSchema>;
    next();
  };
}

export function validateQuery<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return zodErrRes(res, parsed);
    res.locals.query = parsed.data;
    next();
  };
}

export function validateParams<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) return zodErrRes(res, parsed);

    req.params = parsed.data as any;
    next();
  };
}
