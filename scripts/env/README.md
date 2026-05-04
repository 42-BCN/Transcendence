# Environment Setup

Use [setup-env.sh](./setup-env.sh) to generate the local `.env.<env>` files used by the compose stack.

## What it generates

- `containers/nginx/.env.<env>`
- `containers/backend/docker/.env.<env>`
- `containers/socket/docker/.env.<env>`
- `containers/frontend/docker/.env.<env>`
- `containers/database/docker/.env.<env>`

## Socket service runtime env

The socket service reads `SOCKET_CORS_ORIGINS` at runtime from Docker Compose. The default local value is `https://localhost:8443`, and you can override it by exporting `SOCKET_CORS_ORIGINS` before running the stack.

`setup-env.sh` generates a dedicated `containers/socket/docker/.env.<env>` file. Only shared variables are synchronized between services: currently `SOCKET_INTERNAL_SECRET` is generated once and written to both backend and socket env files.

## Template files

Tracked example templates live next to the generated files as `*.example` files. Update those templates when a new variable is added so the local setup stays reproducible without committing secrets.

## Certificates

The setup script bootstraps the local certificates in `certs/` when they are missing. The frontend server and the HTTPS compose stack expect the leaf cert pair at `/certs/localhost.key` and `/certs/localhost.crt` with `ca.pem` as the trust root.