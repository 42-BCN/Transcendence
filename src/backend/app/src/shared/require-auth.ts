import type { Request, Response, NextFunction } from "express";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('cookie header:', req.headers.cookie);
console.log('session:', req.session);
  if (!req.session.userId) {
    return res.status(401).json({
	  ok: false, 
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
  }

  next();
}