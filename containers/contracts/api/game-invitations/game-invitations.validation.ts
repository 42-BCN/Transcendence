import { z } from 'zod';

export const SendGameInvitationBodySchema = z.strictObject({
  friendUserId: z.string().uuid(),
});

export type SendGameInvitationBody = z.infer<typeof SendGameInvitationBodySchema>;

export const AcceptGameInvitationBodySchema = z.strictObject({
  invitationId: z.string().uuid(),
});

export type AcceptGameInvitationBody = z.infer<typeof AcceptGameInvitationBodySchema>;

export const DeclineGameInvitationBodySchema = z.strictObject({
  invitationId: z.string().uuid(),
});

export type DeclineGameInvitationBody = z.infer<typeof DeclineGameInvitationBodySchema>;
