import type {
  GameInvitationView,
} from '@/contracts/api/game-invitations/game-invitations.contracts';

export type { GameInvitationView };

export type GameInvitationsState = {
  invitationsById: Record<string, GameInvitationView>;
  hasLoaded: boolean;
  error: string | null;

  setInvitationState: (payload: {
    invitations: GameInvitationView[];
  }) => void;
  upsertInvitation: (invitation: GameInvitationView) => void;
  markInvitationStatus: (invitationId: string, status: GameInvitationView['status']) => void;
  resetInvitationState: () => void;
};
