# Environment Setup

Use [setup-env.sh](./setup-env.sh) to generate the local `.env.<env>` files used by the compose stack.

## What it generates

- `containers/nginx/.env.<env>`
- `containers/backend/docker/.env.<env>`
- `containers/frontend/docker/.env.<env>`
- `containers/database/docker/.env.<env>`

## Template files

Tracked example templates live next to the generated files as `*.example` files. Update those templates when a new variable is added so the local setup stays reproducible without committing secrets.

## Certificates

The setup script bootstraps the local certificates in `certs/` when they are missing. The frontend server and the HTTPS compose stack expect the leaf cert pair at `/certs/localhost.key` and `/certs/localhost.crt` with `ca.pem` as the trust root.