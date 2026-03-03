import type { Request, Response, NextFunction } from "express";

import { AUTH_ERROR_STATUS } from "../contracts/api/auth/auth.errors";

export class ApiError extends Error {
  code: string;
  constructor(code: string) {
    super("ApiError extend class");
    this.code = code;
  }
}

function errorStatus(code: string): number {
  return AUTH_ERROR_STATUS[code as keyof typeof AUTH_ERROR_STATUS] ?? 500;
}

export function sendError(res: Response, code: string): void {
  console.error(`APIRESTER RETURN `);
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
  if (err instanceof ApiError) return sendError(res, err.code);

  console.error(err);

  res.status(500).json({
    ok: false,
    error: { code: "INTERNAL_ERROR" },
  });
}
