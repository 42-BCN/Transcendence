import { z } from 'zod';

export const SendFriendRequestBodySchema = z.object({
  targetUserId: z.string().uuid(),
});

export type SendFriendRequestBody = z.infer<typeof SendFriendRequestBodySchema>;

export const RespondFriendRequestBodySchema = z.object({
  friendshipId: z.string().uuid(),
  action: z.enum(['accept', 'reject']),
});

export type RespondFriendRequestBody = z.infer<typeof RespondFriendRequestBodySchema>;
