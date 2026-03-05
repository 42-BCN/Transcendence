import type { Request, Response, NextFunction } from "express";

import { AUTH_ERRORS } from "@contracts/auth/auth.errors";
import type { ResErrorsName } from "@contracts/http/errors";

export class ApiError extends Error {
  code: ResErrorsName;
  constructor(code: ResErrorsName) {
    super(code);
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype); // Preserve stack traces
  }
}
// TODO this is repeated at auth.controller - make a helper
export function errorStatus(code: string): number {
  return AUTH_ERRORS[code as keyof typeof AUTH_ERRORS] ?? 500;
}
// TODO this is repeated at auth.controller - make a helper
export function sendError(res: Response, code: string): void {
  res.status(errorStatus(code)).json({
    ok: false,
    error: { code },
  });
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const errCode = err instanceof ApiError ? err.code : "INTERNAL_ERROR";
  console.error(err instanceof ApiError ? `API ERROR: ${err.code} ${err}` : err);
  if (res.headersSent) return;
  sendError(res, errCode);
}
