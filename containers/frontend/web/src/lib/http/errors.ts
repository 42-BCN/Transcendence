import type { ZodError } from 'zod';
import type { ValidationCode, ValidationErrorDetails } from '@/contracts/api/http';

export class FetcherError extends Error {
  status: number;
  body?: unknown;

  constructor(status: number, body?: unknown) {
    super(`Request failed: ${status}`);
    this.name = 'FetcherError';
    this.status = status;
    this.body = body;
  }
}

export function getFieldError(
  error: ZodError,
  field: string,
  fallback: ValidationCode = 'REQUIRED',
): ValidationCode {
  const issue = error.issues.find((i) => i.path[0] === field);
  return (issue?.message as ValidationCode | undefined) ?? fallback;
}

export function getValidationErrorResult(error: ZodError): {
  ok: false;
  error: {
    code: 'VALIDATION_ERROR';
    details: ValidationErrorDetails;
  };
} {
  const fields: Record<string, ValidationCode[]> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'root');
    const code = issue.message as ValidationCode;

    if (!fields[field]) {
      fields[field] = [];
    }

    fields[field].push(code);
  }

  return {
    ok: false,
    error: {
      code: 'VALIDATION_ERROR',
      details: { fields },
    },
  };
}
