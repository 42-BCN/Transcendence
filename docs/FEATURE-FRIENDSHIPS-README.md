# Friendship System

## Status: Merged into `main`

The friendship system is fully implemented and integrated into the main codebase. This document describes the implemented API.

---

## Files

### Backend

- `containers/backend/app/src/friendships/friendships.repo.ts` — data access with Prisma
- `containers/backend/app/src/friendships/friendships.service.ts` — business logic
- `containers/backend/app/src/friendships/friendships.controller.ts` — HTTP handlers
- `containers/backend/app/src/friendships/friendships.routes.ts` — API routes
- `containers/backend/app/src/friendships/friendships.notify.ts` — real-time notifications
- `containers/backend/app/src/friendships/friendships.presence.ts` — presence integration
- `containers/backend/app/src/friendships/friendships.logs.ts` — logging utilities

### Contracts

- `containers/contracts/api/friendships/friendships.contracts.ts` — TypeScript types
- `containers/contracts/api/friendships/friendships.validation.ts` — Zod schemas
- `containers/contracts/api/friendships/friendships.errors.ts` — error codes

---

## API Endpoints

All endpoints are under `/api/friends` and require authentication.

### `GET /api/friends`
List accepted friends (simple format: id, username, avatar, presence).

**Response**: `{ "ok": true, "data": { "friends": [...] } }`

---

### `GET /api/friends/detailed`
List accepted friendships with full details (status, isSender, createdAt, avatar).

**Response**: `{ "ok": true, "data": { "friendships": [...] } }`

---

### `GET /api/friends/requests/pending`
Get pending requests received (where current user is NOT the sender).

**Response**: `{ "ok": true, "data": { "requests": [...] } }`

---

### `GET /api/friends/requests/sent`
Get sent pending requests.

**Response**: `{ "ok": true, "data": { "requests": [...] } }`

---

### `POST /api/friends/request`
Send a friend request.

**Body**: `{ "targetUserId": "uuid" }`

**Response**: `{ "ok": true, "data": { "friendship": {...}, "wasAutoAccepted": false } }`

---

### `POST /api/friends/respond`
Accept or reject a friend request.

**Body**: `{ "friendshipId": "uuid", "action": "accept" | "reject" }`

**Response**: `{ "ok": true, "data": { "friendship": {...}, "action": "accept" } }`

---

### `DELETE /api/friends/:friendshipId`
Remove an accepted friendship or cancel a pending one. Only the two participants may delete; others get **403**. Missing id → **404**.

**Response**: `{ "ok": true, "data": { "deleted": true } }`

---

**Author**: Joan Navarro
