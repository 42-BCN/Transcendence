import type { Request, Response } from "express";

import { emitToUser, getUsersOnlineStatus } from "../features/friends.socket";

export function handleInternalNotify(req: Request, res: Response): void {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  if (secret) {
    const header = req.headers["x-internal-secret"];
    if (header !== secret) {
      res.status(401).json({ ok: false });
      return;
    }
  }

  const body = req.body as {
    event?: unknown;
    userId?: unknown;
    payload?: unknown;
  };

  if (
    typeof body.event !== "string" ||
    body.event.length === 0 ||
    typeof body.userId !== "string" ||
    body.userId.length === 0
  ) {
    res.status(400).json({ ok: false });
    return;
  }

  emitToUser(body.userId, body.event, body.payload ?? {});
  res.json({ ok: true });
}

export function handlePresenceCheck(req: Request, res: Response): void {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  if (secret) {
    const header = req.headers["x-internal-secret"];
    if (header !== secret) {
      res.status(401).json({ ok: false });
      return;
    }
  }

  const body = req.body as { userIds?: unknown };

  if (!Array.isArray(body.userIds)) {
    res.status(400).json({ ok: false });
    return;
  }

  const userIds = body.userIds.filter(
    (id): id is string => typeof id === "string",
  );
  const status = getUsersOnlineStatus(userIds);

  res.json({ ok: true, data: { status } });
}
