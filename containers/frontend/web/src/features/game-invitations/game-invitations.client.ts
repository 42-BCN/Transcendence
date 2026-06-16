'use client';

import type {
  AcceptGameInvitationResponse,
  DeclineGameInvitationResponse,
  GetGameInvitationStateResponse,
  SendGameInvitationResponse,
} from '@/contracts/api/game-invitations/game-invitations.contracts';
import { envPublic } from '@/lib/config/env.public';

function createEndpoint(pathname: string) {
  return `${envPublic.apiBaseUrl.replace(/\/$/, '')}${pathname}`;
}

export async function fetchGameInvitationState() {
  const response = await fetch(createEndpoint('/protected/game-invitations/state'), {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  return (await response.json()) as GetGameInvitationStateResponse;
}

export async function sendGameInvitation(friendUserId: string) {
  const response = await fetch(createEndpoint('/protected/game-invitations/send'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ friendUserId }),
  });

  return (await response.json()) as SendGameInvitationResponse;
}
export async function acceptGameInvitation(invitationId: string) {
  const response = await fetch(createEndpoint('/protected/game-invitations/accept'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ invitationId }),
  });

  return (await response.json()) as AcceptGameInvitationResponse;
}

export async function declineGameInvitation(invitationId: string) {
  const response = await fetch(createEndpoint('/protected/game-invitations/decline'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ invitationId }),
  });

  return (await response.json()) as DeclineGameInvitationResponse;
}
