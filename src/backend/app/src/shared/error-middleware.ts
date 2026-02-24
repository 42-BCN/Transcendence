import type { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  res.status(500).json({
    ok: false,
    error: { code: "INTERNAL_ERROR" },
  });
}
