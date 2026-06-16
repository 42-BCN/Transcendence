import type { GameInvitationsState } from './game-invitations.types';

export function selectActiveInvitationCount(state: GameInvitationsState): number {
  return Object.values(state.invitationsById).filter((invitation) => invitation.status === 'pending')
    .length;
}
