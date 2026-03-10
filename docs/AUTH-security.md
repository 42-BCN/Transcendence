# [AUTH][SPIKE] Security Baseline Definition — Resolution

## Threat → Mitigation Table

| Threat               | Description                                         | Attacker Goal                   | Mitigation                              |
| -------------------- | --------------------------------------------------- | ------------------------------- | --------------------------------------- |
| Brute Force Login    | Repeated password attempts against a known account  | Gain access                     | Per-IP rate limiting + per-account lock |
| Credential Stuffing  | Automated attempts using leaked credentials         | Exploit password reuse          | Rate limiting + strong password hashing |
| Account Enumeration  | Detect if email exists from response differences    | Build account lists             | Generic error responses                 |
| Session Fixation     | Attacker forces known session ID before login       | Hijack authenticated session    | Session regeneration on login           |
| CSRF                 | Browser tricked into sending authenticated requests | Perform actions without consent | SameSite cookies + CSRF protection      |
| Password Reset Abuse | Abuse reset tokens or spam reset flow               | Account takeover                | Expiring high-entropy tokens            |
| Rate Abuse           | Flood auth endpoints                                | DoS or bypass controls          | Nginx + backend rate limits             |

---

## Mitigation Enforcement Layer

| Mitigation                        | Layer   |
| --------------------------------- | ------- |
| IP login rate limit               | Nginx   |
| Per-account failed login tracking | Backend |
| Account temporary lock            | Backend |
| Session regeneration              | Backend |
| CSRF protection                   | Backend |
| Secure cookies                    | Backend |
| TLS termination                   | Nginx   |

---

## Rate Limiting Policy

### Authentication Rate Limiting Policy

To protect authentication endpoints from abuse, rate limits are enforced at the **edge and backend layers**. The frontend may apply optional UI throttling for usability, but it is **not a security enforcement layer**.

---

### Edge Rate Limiting (IP-Based)

All authentication endpoints are protected by a **reverse-proxy rate limit**.

| Scope  | Limit                 | Enforcement Layer |
| ------ | --------------------- | ----------------- |
| Per IP | 5 requests per minute | Nginx             |

Behavior:

- Any authentication request exceeding **5 requests per minute per IP** is temporarily rate limited at the reverse-proxy layer.
- This rule applies uniformly to **all authentication endpoints**.

Protected endpoints include:

- `POST /auth/login`
- `POST /auth/password-reset-request`
- `POST /auth/signup`

---

### Backend Abuse Protections

Because reverse proxies cannot reliably enforce **account-target protections**, the backend enforces additional safeguards.

| Protection                     | Limit                  | Enforcement Layer |
| ------------------------------ | ---------------------- | ----------------- |
| Failed auth endpoints attempts | 3 attempts per account | Backend           |
| Cooldown duration              | 15 minutes             | Backend           |

Behavior:

- Accounts are **temporarily locked for 15 minutes after 3 failed login attempts**.
- Password reset requests are limited to **3 per account within a 15-minute window**.
- Signup attempts are limited to **3 per email within a 15-minute window**.
- Reset tokens expire after **15 minutes** and are **single-use**.

---

## Password Reset Policy

| Rule          | Value                    |
| ------------- | ------------------------ |
| Token expiry  | **15 minutes**           |
| Token entropy | cryptographically secure |
| Token reuse   | not allowed              |
| Token storage | hashed in database       |

---

## Password Policy

| Rule               | Value         |
| ------------------ | ------------- |
| Minimum length     | 8 characters  |
| Maximum length     | 72 characters |
| Letters            | required      |
| Numbers            | required      |
| Special characters | allowed       |
| Spaces             | allowed       |

Hashed with argon2.

---

## Session Security and CSRF Protection

Session must:

- regenerate on login
- use secure cookies

### Cookie Policy

Session cookies must use the following configuration:

HttpOnly = true
Secure = true
SameSite = Lax

### CSRF Token Validation

See and apply:
https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

---

## Account Enumeration Protection

Login responses must be **generic**.

Example response:

```json
{
  "ok": false,
  "error": { "code": "AUTH_INVALID_CREDENTIALS" }
}
```

See [figma flows](https://www.figma.com/board/5ZO6zA1HLrfQgeF7QjCVn6/User-flows?node-id=0-1&p=f&t=gNahjrDTVpPFdAZ6-0) for more details.
