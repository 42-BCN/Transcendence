# Frontend Environment Variables

- Public variables use `NEXT_PUBLIC_*`.
- Server-only variables are never exposed to the browser.
- All access goes through `envPublic` / `envServer`.
- Missing variables throw immediately.
- Direct `process.env` access is prohibited.
- Boolean values must be parsed explicitly.

---

## 1. Types of Environment Variables

| Type                  | Prefix          | Available In    | When Evaluated                       | Visible in Browser | Notes                                                                    |
| --------------------- | --------------- | --------------- | ------------------------------------ | ------------------ | ------------------------------------------------------------------------ |
| Public Variables      | `NEXT_PUBLIC_*` | Client + Server | Build / compile time                 | ✅ Yes             | Baked into the browser bundle. Changing them requires rebuild/restart.   |
| Server-Only Variables | No prefix       | Server only     | Runtime (if not statically compiled) | ❌ No              | Undefined in Client Components. Must never be imported into client code. |

---

## 2. Where Environment Variables Are Defined

Frontend environment variables are defined in:

`./web/docker/.env.development`

```sh
NEXT_PUBLIC_APP_URL=https://localhost:8443
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_LOCALE_COOKIE_ENABLED=false
NEXT_PUBLIC_LOCALE_COOKIE_NAME=locale

NODE_ENV=development
API_BASE_URL=http://express:3000
```

Only non-secret values are allowed in the frontend container.

Secrets (database credentials, API keys, JWT secrets, etc.) must never exist in the frontend environment.

---

## 3. How Environment Variables Are Injected

In `docker-compose.yml`:

```yaml
web:
  env_file:
    - ./web/docker/.env.development
```

When Docker starts the `web` container, each line in the file is injected as an environment variable into the container process.

---

## 4. How Environment Variables Are Accessed in Code

Environment variables must only be accessed through:

- `envPublic`
- `envServer`

File locations:

```
/src/lib/env.public.ts
/src/lib/env.server.ts
```

Direct usage of `process.env` outside these modules is prohibited and enforced via ESLint.

Missing variables throw at startup using required helpers (fail fast strategy).

---

## 5. Boolean Handling

Environment variables are always strings.

Example:

```sh
NEXT_PUBLIC_LOCALE_COOKIE_ENABLED=false
```

This is `"false"` (string), not `false` (boolean).

Always parse explicitly:

```ts
value === "true";
```

Never rely on truthiness (`if (value)`), because `"false"` is truthy.
