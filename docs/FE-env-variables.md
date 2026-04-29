# Frontend Environment Variables

- Public variables use `NEXT_PUBLIC_*`.
- Server-only variables are never exposed to the browser.
- All access goes through `envPublic` / `envServer`.
- Missing variables throw immediately.
- Direct `process.env` access is prohibited.
- Boolean values must be parsed explicitly.

---

## 1. Types of Environment Variables

| Type                  | Prefix          | Available In    | When Evaluated                       | Visible in Browser | Configured Via                   | Notes                                                                    |
| --------------------- | --------------- | --------------- | ------------------------------------ | ------------------ | -------------------------------- | ------------------------------------------------------------------------ |
| Public Variables      | `NEXT_PUBLIC_*` | Client + Server | Build / compile time                 | ✅ Yes             | Docker build args (`--build-arg`) | **Baked into the browser bundle.** Changing them requires rebuilding the Docker image. Not configurable at runtime. |
| Server-Only Variables | No prefix       | Server only     | Runtime (if not statically compiled) | ❌ No              | Runtime env files or variables   | Undefined in Client Components. Must never be imported into client code. |

---

## 2. Where Environment Variables Are Defined

### Public Variables (`NEXT_PUBLIC_*`) — Build-Time Only

Public variables are **not** defined in `.env` files because they must be baked into the JavaScript bundle during image build. They are configured via Docker build arguments:

```dockerfile
# containers/frontend/docker/Dockerfile
ARG NEXT_PUBLIC_APP_URL=https://localhost:8443
ARG NEXT_PUBLIC_API_BASE_URL=/api
ARG NEXT_PUBLIC_SOCKET_URL=https://localhost:8443
ARG NEXT_PUBLIC_LOCALE_COOKIE_NAME=locale

RUN NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
    NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
    npm run build
```

And passed from `docker-compose.yml`:

```yaml
frontend:
  build:
    args:
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-https://localhost:8443}
      NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL:-/api}
```

**To use different values for a different environment (demo, production, etc.), rebuild the Docker image with different build args.** Runtime environment variables have no effect on public variables.

### Server-Only Variables — Runtime Configuration

Runtime variables are defined in the tracked example template and generated local env files:

`./containers/frontend/docker/.env.development.example`

`./containers/frontend/docker/.env.development`

`./containers/frontend/docker/.env.demo`

`./containers/frontend/docker/.env.production`

Example:

```sh
NODE_ENV=development
API_BASE_URL=https://backend:4000
PORT=3000
HOSTNAME=0.0.0.0
HTTPS_KEY_PATH=/certs/localhost.key
HTTPS_CERT_PATH=/certs/localhost.crt
```

Only non-secret values are allowed in the frontend container.

Secrets (database credentials, API keys, JWT secrets, etc.) must never exist in the frontend environment.

---

## 3. How Environment Variables Are Injected

### Public Variables (`NEXT_PUBLIC_*`)

Passed at **image build time** via Docker build arguments:

```bash
# In docker-compose.yml
frontend:
  build:
    dockerfile: ./frontend/docker/Dockerfile
    args:
      NEXT_PUBLIC_APP_URL: https://localhost:8443
      NEXT_PUBLIC_API_BASE_URL: /api
```

These are evaluated during `RUN npm run build` and baked into the static JavaScript. Changing them requires rebuilding the image.

### Server-Only Variables

Injected at **container runtime** via env files:

```yaml
# In docker-compose.yml
frontend:
  env_file:
    - ./frontend/docker/.env.${APP_ENV:-development}
```

When Docker starts the `frontend` container, each line in the file is injected as an environment variable accessible to the Node.js server process.

---

## 4. How Environment Variables Are Accessed in Code

Environment variables must only be accessed through:

- `envPublic`
- `envServer`

File locations:

```
/src/lib/config/env.public.ts
/src/lib/config/env.server.ts
```

Direct usage of `process.env` outside these modules is prohibited and enforced via ESLint.

Missing variables throw at startup using required helpers (fail fast strategy).

The HTTPS server entrypoint also reads `PORT`, `HOSTNAME`, `HTTPS_KEY_PATH`, and `HTTPS_CERT_PATH` from the container environment.

---

