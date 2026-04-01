## Email implementation

### Flow where mails are required

- Password reset email: **required**
- Email verification: **included**
- Resend verification: **included**, with cooldown
- Resend password reset: **included**, with abuse controls and generic responses

### Provider and sending mechanism

- implement a Gmail API transport first, per current requirement

### Token format and storage

For both password reset and email verification:

- opaque random tokens
- high entropy, cryptographically secure generation
- token included in frontend link
- only `token_hash` stored in DB
- raw token never persisted
- one-time-use enforcement via `used_at`
- explicit expiry
- previous active token invalidated on new issuance for the same flow/user

### Expiry and cooldown policy

- Password reset token expiry: **15 minutes**
- Email verification token expiry: **short-lived and explicit**, aligned with implementation decision
- Resend verification cooldown: **minimum 60 seconds**
- Password reset request abuse limit: **3 requests per account per 15 minutes**
- Login/account lock remains a separate backend protection

### Email content and frontend links

Emails should contain frontend URLs, not backend action pages.

Examples:

- password reset → frontend reset page with token parameter
- email verification → frontend verify page with token parameter

Rules:

- never include secrets in logs
- never leak whether an email exists in password reset responses
- keep copy generic for reset request confirmation

### Abuse controls and enforcement boundaries

- **Nginx**: per-IP rate limiting on auth endpoints
- **Backend**: per-account/email abuse controls, cooldowns, token issuance rules, single-use validation, generic responses
- **Database**: hashed token storage and token lifecycle fields
- **Logging**: structured events only, no raw tokens, no secrets

### i18n and templates

- backend-owned templates
- minimal template set:
  - password reset
  - email verification
- Very limited locale set if already available

### Usability

- user opens email
- clicks link
- lands on frontend reset/verify page
- completes the flow in browser/PWA

### TL;DR

- V1 includes password reset and email verification
- Gmail API transport is the initial sending mechanism behind an abstraction
- tokens are opaque, random, hashed at rest, expiring, and single-use
- reset responses remain generic to prevent enumeration
- cooldowns and abuse controls are enforced at backend + edge layers
