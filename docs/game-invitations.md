# Game Invitations

Feature that lets friends invite each other to join a game room via direct message.

## Overview

A user sends a game invitation from the social sidebar. The invitation is persisted as a special direct-message card and is also exposed through a canonical invitation-state API used by the social dashboard, the DM thread, and the room panel. The recipient can accept or decline it. Invitations expire after 5 minutes.

## Architecture

The feature spans all four containers:

```
Frontend → Backend (REST) → Socket Service (internal HTTP) → Frontend (socket push)
```

- **Backend** owns persistence (Prisma), business rules, rate limiting, and socket notifications.
- **Socket Service** owns in-memory room state (`GameRoomsManager`) and validates room availability at accept time via internal HTTP endpoints.
- **Frontend** renders invitation cards in the DM chat, the social dashboard invitations tab, and the room panel from one canonical Zustand invitation store. It navigates to `/game` on successful accept.

## Flow

### Sending an invitation

1. Frontend calls `POST /protected/game-invitations/send` with `{ friendUserId }`.
2. Backend checks friendship, rate limits, and duplicate guards (see [Rate Limits](#rate-limits)).
3. Backend calls socket service `POST /internal/game-invitations/prepare-room` — creates or retrieves the sender's game room. Requires the sender to have an active `/game-room` socket connection.
4. Backend calls socket service `POST /internal/game-invitations/validate-receiver` — blocks only if the invitee's current room is already full.
5. Backend saves a `game_invitation` direct message record in the DB.
6. Backend pushes the invitation card to the recipient's DM socket (`dm:message`) and invalidates both users' invitation state via the friends socket (`game:invitations:updated`).

### Accepting an invitation

1. Frontend calls `POST /protected/game-invitations/accept` with `{ invitationId }`.
2. Backend validates the invitation is not expired, not already accepted, and has a room assigned.
3. Backend calls socket service `POST /internal/game-invitations/accept-room` — moves the invitee into the inviter's room (removes them from any previous room first, broadcasts room state changes).
4. Backend marks the invitation as accepted in the DB.
5. Backend pushes canonical invitation-state invalidations to the accepting user, the original sender, and any users affected by the acceptor's room change.
6. Frontend receives the updated room state, refreshes canonical invitation state, and navigates to `/game`.

### Declining an invitation

1. Frontend calls `POST /protected/game-invitations/decline` with `{ invitationId }`.
2. Backend validates the invitation belongs to the current user, is still pending, and is not expired.
3. Backend marks the invitation as cancelled in the DB.
4. Backend notifies both the invitee and inviter so all invitation surfaces refresh from canonical state.

### Leaving a room

When a user explicitly leaves a room or disconnects (after a grace period), the socket service calls `POST /internal/game-invitations/notify-invitees` on the backend. The backend looks up all users who have a pending invitation from that user and pushes them an invalidation event, causing all invitation surfaces to refresh and render those invitations as unavailable.

## Canonical Invitation State

The backend is authoritative for invitation status. Frontend surfaces read from `GET /protected/game-invitations/state`, which returns normalized `GameInvitationView` items with a canonical `status`:

- `pending`
- `accepted`
- `expired`
- `unavailable`
- `cancelled`

The frontend `game-invitations` store is the single source of truth for:

- direct-message invitation cards
- the social dashboard invitation tab and badge
- the room invitation panel

## Invitation Card States

Cards are rendered in `ChatMain` (`chat.main.tsx`) from canonical status with the following precedence:

| Condition | Sender sees | Recipient sees |
|---|---|---|
| Invitation sent, pending | "Game invitation sent" | "Join game" button |
| Invitation cancelled / declined | "Game invitation declined" | "Game invitation declined" |
| Recipient is already in any room | — | "You have already joined a game room." |
| Invitation accepted | "Game invitation accepted" | "Game invitation accepted" |
| Invitation expired (past `expiresAt`) | "Game invitation expired" | "Game invitation expired" |
| Room gone or inviter left (`unavailable`) | "Game room is no longer available" | "Game room is no longer available" |
| Accept / decline failed (race / stale state) | — | Inline error below button |

## Real-time Updates

Realtime updates on the `/friends` namespace are now invalidation-driven:

- `game:invitations:updated`
- `game:invitations:received`

The frontend does not maintain separate local invitation buffers or summary-only state anymore. On mount and after invitation invalidation events, `SocialSocketBridge` refreshes the full canonical invitation state via `GET /protected/game-invitations/state`.

## Rate Limits

All limits are enforced in `game-invitations.service.ts`:

| Rule | Limit | Error |
|---|---|---|
| Invitation TTL | 5 minutes | `GAME_INVITATION_EXPIRED` |
| Same-user cooldown (re-invite same person) | 60 seconds | `GAME_INVITATION_RECENT_DUPLICATE` |
| Older duplicate to same person still pending | — | `GAME_INVITATION_DUPLICATE_PENDING` |
| Max concurrent pending sent invitations | 5 | `GAME_INVITATION_PENDING_LIMIT` |
| Max sent in a 10-minute rolling window | 10 | `GAME_INVITATION_RATE_LIMITED` |

## Error Codes

Defined in `contracts/api/game-invitations/game-invitations.errors.ts`:

| Code | HTTP | When |
|---|---|---|
| `GAME_INVITATION_NOT_FRIEND` | 403 | Users are not friends |
| `GAME_INVITATION_NOT_FOUND` | 404 | Invitation ID does not exist or belongs to another user |
| `GAME_INVITATION_ALREADY_IN_ROOM` | 409 | Invitee's current room is full |
| `GAME_INVITATION_ALREADY_ACCEPTED` | 409 | Invitation was already accepted (race condition guard) |
| `GAME_INVITATION_ALREADY_CANCELLED` | 409 | Invitation was already declined/cancelled |
| `GAME_INVITATION_DUPLICATE_PENDING` | 409 | A pending invitation to this person already exists |
| `GAME_INVITATION_EXPIRED` | 409 | Invitation past its 5-minute TTL |
| `GAME_INVITATION_NOT_JOINABLE` | 409 | Room was valid but accept failed at the socket layer |
| `GAME_INVITATION_ROOM_REQUIRED` | 409 | Sender has no active `/game-room` socket connection |
| `GAME_INVITATION_ROOM_UNAVAILABLE` | 409 | Room no longer exists or is full |
| `GAME_INVITATION_RECENT_DUPLICATE` | 429 | Invited same person within the 60-second cooldown |
| `GAME_INVITATION_PENDING_LIMIT` | 429 | Sender has 5 pending outgoing invitations |
| `GAME_INVITATION_RATE_LIMITED` | 429 | Sent 10 invitations in the last 10 minutes |

## Socket Service Internal Endpoints

All require the `x-internal-secret` header.

| Method | Path | Purpose |
|---|---|---|
| POST | `/internal/game-invitations/prepare-room` | Ensure sender has a room; returns room state |
| POST | `/internal/game-invitations/validate-receiver` | Check invitee can receive (room not full) |
| POST | `/internal/game-invitations/accept-room` | Move invitee into inviter's room |
| POST | `/internal/game-invitations/status` | Filter a list of invitation IDs to those still actionable |

## Backend Internal Endpoint

| Method | Path | Purpose |
|---|---|---|
| POST | `/internal/game-invitations/notify-invitees` | Push invitation-state invalidations to users holding pending invitations from a given sender (called by socket service on room leave) |

## Cross-Invitation Edge Cases

- **A invites B, B invites A simultaneously** — both invitations are valid. First to accept wins; the other gets `GAME_INVITATION_NOT_JOINABLE` at accept time because the room changed.
- **Acceptor had their own pending invitations** — on accept, the backend pushes invitation-state invalidations to all users who had received invitations from the acceptor, immediately invalidating their cards.
- **Inviter leaves their room after sending** — socket service calls the backend notify endpoint, which pushes an invitation-state invalidation to the invitee. Their card switches from "Join game" to "Game room is no longer available".
- **Invitee is already in a room** — the "Join game" button is hidden (`hasActiveGameRoom`). If they leave their room, the button reappears if the canonical invitation status is still `pending`.

## Database Schema

The invitation is stored as a `DirectMessage` row with `type = 'game_invitation'` and additional columns:

```
gameInvitationRoomId          Int?      — room the invitee should join
gameInvitationInvitedUserId   String?   — recipient UUID
gameInvitationExpiresAt       DateTime? — TTL timestamp
gameInvitationAcceptedAt      DateTime? — set on accept (null = still pending)
gameInvitationAcceptedByUserId String?  — who accepted
gameInvitationCancelledAt     DateTime? — set on decline/cancel
gameInvitationCancelledByUserId String? — who declined/cancelled
```

Indexes on `(gameInvitationInvitedUserId, gameInvitationExpiresAt)` support the hot path of listing actionable invitations for a user.

## Key Files

| File | Role |
|---|---|
| `containers/backend/app/src/game-invitations/game-invitations.service.ts` | Business logic, rate limits, orchestration |
| `containers/backend/app/src/game-invitations/game-invitations.socket-client.ts` | HTTP client for socket service internal APIs |
| `containers/backend/app/src/direct-messages/direct-messages.repo.ts` | DB queries including `listPendingInviteesForSender` |
| `containers/socket/app/src/internal/game-invitations.routes.ts` | Socket service internal endpoints |
| `containers/socket/app/src/features/game-room/gameRoom.socket.ts` | Room leave hooks that trigger invitee notifications |
| `containers/contracts/api/game-invitations/` | Shared types, error codes, validation schemas |
| `containers/frontend/web/src/features/game-invitations/game-invitations.client.ts` | Frontend API client (send, accept, decline, fetch canonical state) |
| `containers/frontend/web/src/features/game-invitations/store/` | Canonical frontend invitation store |
| `containers/frontend/web/src/features/chat/chat.main.tsx` | Invitation card rendering logic |
| `containers/frontend/web/src/features/direct-messages/direct-messages.tsx` | Accept/decline handlers, joining state, error surfacing |
| `containers/frontend/web/src/features/social/store/social-store.bridge.tsx` | Socket bridge for invitation-state invalidation and refetch |
| `containers/frontend/web/src/features/social/social-variants/social-user-actions.tsx` | "Invite to game" button with feedback pill |
