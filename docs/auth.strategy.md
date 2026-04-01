# Authentication Strategy Documentation V0

## 1. Overview

We use **server-side session authentication with cookies**.

The cookie contains only a **session identifier**.
All session state lives on the server.

---

## 2. Why Session Cookies (Not JWT)

We intentionally use server-managed sessions instead of JWT.

Reasons:

- Immediate session revocation
- Backend visibility of active sessions
- No tokens stored in localStorage (reduced XSS risk)
- Cleaner WebSocket integration
- Better fit for multiplayer control
- Simpler security model

JWT tokens are self-contained and typically stateless.
Our system is intentionally stateful.

---

## 3. Session Storage

Sessions are stored in **Redis**.

The cookie contains only the session identifier.
All session state lives in Redis and is managed server-side.

On every authenticated request:

1. Extract cookie
2. Validate session existence in Redis
3. Validate expiration
4. Refresh idle expiration if applicable
5. Continue request

---

## 3. Session Storage

Sessions are stored in **Redis**.

The cookie contains only the session identifier.
All session state lives in Redis and is managed server-side.

On every authenticated request:

1. Extract cookie
2. Validate session existence in Redis
3. Validate expiration
4. Refresh idle expiration if applicable
5. Continue request

---

## 5. Session Lifecycle

### 5.1 Sliding Expiration (Auto-Slide)

We use sliding expiration:

- Every authenticated request refreshes the idle timeout.
- Active users remain logged in.

Example policy:

- Idle timeout: 2 days since last activity
- Absolute timeout: defined hard cap (team-defined) -> No apply

Both must be validated server-side.

---

### 5.3 Expiration Handling

When a session expires:

- Backend deletes the session record.
- Frontend clears the cookie.

Backend is always the source of truth.

---

## 6. Single Session Policy

We allow only **one active session per user**.

On login:

1. Delete existing sessions for user
2. Create new session
3. Issue new session cookie

This prevents:

- Multi-device login
- Concurrent browser sessions
- Account sharing
- Multiplayer state conflicts

Possible future extensions:

- Support multiple sessions per user
- Store sessions per device
- Allow session revocation UI

---

## 7. ID Rotation

On login or privilege change:

1. Generate new session ID
2. Invalidate previous session
3. Issue new cookie

Purpose:

- Prevent session fixation attacks
- Maintain session integrity

---

## 8. WebSocket (WSS) Authentication

WebSocket authentication uses the same session cookie.

During handshake:

1. Extract sessionId
2. Validate session
3. Reject if invalid
4. Register socket

Policy:

- Only one active WebSocket connection per session
- If a second connection opens, the previous one is disconnected

If a session is revoked:

- Active socket is disconnected

---

## Append (Nice to have documentation)

## 1. CSRF Strategy

Because OAuth is enabled:

- SameSite=Lax
- CSRF token validation is required for:
  - POST
  - PUT
  - PATCH
  - DELETE

CSRF applies to HTTP requests where cookies are automatically included.
CSRF does not apply to WebSocket messages the same way as form-based HTTP requests.
Change: Redis migration path

It currently says:

current architecture = PostgreSQL sessions
future architecture = Redis sessions.

That is no longer true.

Replace “## 2. Redis Migration Path” with:

## 2. Session Storage Architecture

Current architecture:

Client → Backend → Redis (sessions)
↓
PostgreSQL (user data)

Why Redis:

- Lower latency
- Native TTL
- Better horizontal scaling
- Better fit for ephemeral session state
- Cleaner session invalidation across instances
- Better alignment with WebSocket/session sharing

---
