import type { z } from "zod";

import type {
  ValidationErrorDetails,
  ValidationCode,
} from "../contracts/api/http/validation";
import { VALIDATION } from "../contracts/api/http/validation";

/**
 * Converts Zod issues into your { fields: { [path]: ValidationCode[] } } shape.
 * - Uses issue.message as ValidationCode (because you already set message: VALIDATION.* in schemas)
 * - Falls back to VALIDATION.INVALID_FORMAT if it’s not one of your codes
 */
export function toValidationDetails(error: z.ZodError): ValidationErrorDetails {
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
