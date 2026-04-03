# [AUTH][SPIKE] User Data Model & Credential Policy

## 1) User Data Model

| Field | Type | Null | Notes |
|---|---|---:|---|
| `id` | UUID | No | Primary key |
| `email` | TEXT | No | Unique, normalized to lowercase |
| `username` | TEXT | No | Unique |
| `password_hash` | TEXT | Yes | Nullable for OAuth-only accounts |
| `provider` | TEXT | No | Default `local`; used for initial auth source |
| `google_id` | TEXT | Yes | Unique; nullable for non-Google users |
| `email_verified_at` | TIMESTAMPTZ | Yes | Preferred over boolean `email_verified` |
| `failed_attempts` | INTEGER | No | Default `0` |
| `locked_until` | TIMESTAMPTZ | Yes | Temporary account lock until timestamp |
| `last_login_at` | TIMESTAMPTZ | Yes | Last successful login |
| `is_blocked` | BOOLEAN | No | Default `false` |
| `created_at` | TIMESTAMPTZ | No | Default `now()` |
| `updated_at` | TIMESTAMPTZ | No | Default `now()` |

### Notes
- `email_verified_at` is preferred over `email_verified BOOLEAN` because it preserves the event timestamp.
- `password_hash` must be nullable because OAuth-only users may not have a local password.
- `provider` is an indicator of the original auth method, even if future multi-provider support is introduced.

### Constraints
- Primary key on `id`
- Unique constraint on `email`
- Unique constraint on `username`
- Unique constraint on `google_id` when present
- Optional check constraint on `provider IN ('local', 'google')`

---

## 2) Security and Audit Fields

## Decision
Keep only the minimum set of DB audit/security fields needed.

### Included
- `created_at`
- `updated_at`
- `failed_attempts`
- `locked_until`
- `last_login_at`
- `is_blocked`

### Excluded from DB
- `last_login_ip`
- `last_user_agent`

### Rationale
IP address and user-agent storage introduce privacy concerns.

---

## 3) Email Normalization Policy

## Decision
Email addresses must be normalized before storage and lookup.

### Rules
- trim leading and trailing whitespace
- convert to lowercase
- store normalized value in `users.email`
- perform all email lookups using normalized value

### Rationale
This prevents duplicate accounts caused by casing or formatting inconsistencies and simplifies uniqueness enforcement.

---

## 4) Delete Strategy

## Decision
Do not implement user deletion in AUTH_V1.
Use blocking/disable semantics instead.

---

## 5) Session Storage Model

## Decision
Use **Redis** as the preferred session store.

### Storage model
- browser stores only the session ID in a secure cookie
- session data is stored server-side in Redis
- Redis keys expire automatically according to session TTL
- logout destroys server-side session state

### Why Redis
- avoids storing volatile session rows in Postgres
- supports future Socket.IO/shared-session use

### Expiration strategy
Use both:
- **idle expiration**: rolling session expiration extended on active use
- **absolute expiration**: maximum lifetime regardless of activity

Expiration and cookie security rules are defined in `auth.security.md`, which is the security single source of truth.

---

## 6) Password Reset Tokens

## Decision
Use a dedicated `password_resets` table.

### Table definition

| Field | Type | Null | Notes |
|---|---|---:|---|
| `id` | UUID | No | Primary key |
| `user_id` | UUID | No | FK to `users.id` |
| `token_hash` | TEXT | No | Store hashed token only unique|
| `expires_at` | TIMESTAMPTZ | No | Expiration timestamp |
| `used_at` | TIMESTAMPTZ | Yes | One-time use marker |
| `created_at` | TIMESTAMPTZ | No | Default `now()` |

### Rules
- token is one-time use
- token expires
- only hashed token is stored
- previous active reset tokens may be invalidated when issuing a new one
- raw token is only sent to the user, never persisted

## Password Hashing Strategy

Password hashing policy is defined in `auth.security.md`, which is the single source of truth for security rules.

AUTH_V1 uses:

- argon2
- no plaintext password storage
- no password or hash logging

---

## 7) Email Verification Tokens

## Decision
Use a dedicated `email_verifications` table.

### Table definition

| Field | Type | Null | Notes |
|---|---|---:|---|
| `id` | UUID | No | Primary key |
| `user_id` | UUID | No | FK to `users.id` |
| `token_hash` | TEXT | No | Store hashed token only unique |
| `expires_at` | TIMESTAMPTZ | No | Expiration timestamp |
| `used_at` | TIMESTAMPTZ | Yes | One-time use marker |
| `created_at` | TIMESTAMPTZ | No | Default `now()` |

### Rules
- token is one-time use
- token expires
- only hashed token is stored
- resend is allowed but subject to cooldown
- previous active verification tokens may be invalidated when reissuing

### Resend cooldown
Recommended V1 rule:
- minimum resend interval: **60 seconds**
- optional per-user hourly cap can be added later

---

## 8) OAuth Provider Integration

## Decision
AUTH_V1 supports Google login/linking with collision-safe account handling.

### Rules
- one user may have zero or one Google identity in V1
- `google_id` must be unique
- if a verified email matches an existing local user, linking may occur through controlled backend logic
- duplicate accounts must not be created silently
- provider access tokens and refresh tokens must never be stored in plain text

### Future evolution
If multi-provider support is added later, move from inline provider fields to a dedicated `user_identities` table.

---

## 9) Minimal ER Diagram

### Relational model

```text
users
	├──< password_resets
	└──< email_verifications
	- id (PK)
	- email (UQ)
	- username (UQ)
	- password_hash
	- provider
	- google_id (UQ, nullable)
	- email_verified_at
	- failed_attempts
	- locked_until
	- last_login_at
	- is_blocked
	- created_at
	- updated_at

	password_resets
	- id (PK)
	- user_id (FK -> users.id)
	- token_hash (UQ)
	- expires_at
	- used_at
	- created_at

	email_verifications
	- id (PK)
	- user_id (FK -> users.id)
	- token_hash (UQ)
	- expires_at
	- used_at
	- created_at
```
Session note

Sessions are stored in Redis, not represented as a persistent relational table in the primary ER diagram.
