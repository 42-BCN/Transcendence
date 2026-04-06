import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({
      ok: false,
      error: {
        code: 'AUTH_UNAUTHORIZED',
      },
    });
  }

  next();
}
