import type { Request, Response } from 'express';
import { z } from 'zod';

import type {
  AcceptGameInvitationBody,
  SendGameInvitationBody,
} from '@contracts/game-invitations/game-invitations.validation';
import type {
  AcceptGameInvitationResponse,
  GetActiveGameInvitationSummaryResponse,
  SendGameInvitationResponse,
} from '@contracts/game-invitations/game-invitations.contracts';

import {
  acceptGameInvitation,
  getActiveGameInvitationSummary,
  notifyPendingInviteesForSender,
  sendGameInvitation,
} from './game-invitations.service';

function ensureInternalSecret(req: Request, res: Response): boolean {
  const secret = process.env.SOCKET_INTERNAL_SECRET;
  if (!secret) {
    res.status(503).json({ ok: false });
    return false;
  }
  if (req.headers['x-internal-secret'] !== secret) {
    res.status(401).json({ ok: false });
    return false;
  }
  return true;
}

const NotifyInviteesBodySchema = z.object({ userId: z.string().uuid() });

export async function getActiveGameInvitationSummaryController(
  req: Request,
  res: Response<GetActiveGameInvitationSummaryResponse>,
): Promise<void> {
  const summary = await getActiveGameInvitationSummary(req.session.userId!);
  res.status(200).json({ ok: true, data: summary });
}

export async function sendGameInvitationController(
  req: Request<object, object, SendGameInvitationBody>,
  res: Response<SendGameInvitationResponse>,
): Promise<void> {
  const result = await sendGameInvitation(req.session.userId!, req.body.friendUserId);
  res.status(201).json({ ok: true, data: result });
}

export async function acceptGameInvitationController(
  req: Request<object, object, AcceptGameInvitationBody>,
  res: Response<AcceptGameInvitationResponse>,
): Promise<void> {
  const result = await acceptGameInvitation(req.session.userId!, req.body.invitationId);
  res.status(200).json({ ok: true, data: result });
}

export function handleInternalNotifyInvitees(req: Request, res: Response): void {
  if (!ensureInternalSecret(req, res)) return;

  const parsed = NotifyInviteesBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false });
    return;
  }

  void notifyPendingInviteesForSender(parsed.data.userId).then(() => {
    res.json({ ok: true });
  }).catch(() => {
    res.status(500).json({ ok: false });
  });
}
