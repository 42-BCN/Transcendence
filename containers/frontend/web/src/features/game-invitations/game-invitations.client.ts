'use client';

import type {
  AcceptGameInvitationResponse,
  GetActiveGameInvitationSummaryResponse,
  SendGameInvitationResponse,
} from '@/contracts/api/game-invitations/game-invitations.contracts';
import { envPublic } from '@/lib/config/env.public';

function createEndpoint(pathname: string) {
  return `${envPublic.apiBaseUrl.replace(/\/$/, '')}${pathname}`;
}

export async function fetchActiveGameInvitationSummary() {
  const response = await fetch(createEndpoint('/protected/game-invitations/active'), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  return (await response.json()) as GetActiveGameInvitationSummaryResponse;
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
