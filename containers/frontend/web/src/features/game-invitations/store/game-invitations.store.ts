import { createStore } from 'zustand/vanilla';
import type { GameInvitationsState, GameInvitationView } from './game-invitations.types';

function buildInvitationsById(
  invitations: GameInvitationView[],
): Record<string, GameInvitationView> {
  const result: Record<string, GameInvitationView> = {};
  for (const inv of invitations) {
    result[inv.id] = inv;
  }
  return result;
}

export function createGameInvitationsStore() {
  return createStore<GameInvitationsState>((set) => ({
    invitationsById: {},
    hasLoaded: false,
    error: null,

    setInvitationState: (payload) =>
      set({
        invitationsById: buildInvitationsById(payload.invitations),
        hasLoaded: true,
        error: null,
      }),

    upsertInvitation: (invitation) =>
      set((state) => ({
        invitationsById: { ...state.invitationsById, [invitation.id]: invitation },
      })),

    markInvitationStatus: (invitationId, status) =>
      set((state) => {
        const existing = state.invitationsById[invitationId];
        if (!existing) return {};
        return {
          invitationsById: {
            ...state.invitationsById,
            [invitationId]: { ...existing, status },
          },
        };
      }),

    resetInvitationState: () =>
      set({
        invitationsById: {},
        hasLoaded: false,
        error: null,
      }),
  }));
}

export type GameInvitationsStore = ReturnType<typeof createGameInvitationsStore>;
