# Environment Setup

Use [setup-env.sh](./setup-env.sh) to generate the local `.env.<env>` files used by the compose stack.

## What it generates

- `containers/nginx/.env.<env>`
- `containers/backend/docker/.env.<env>`
- `containers/cloudflared/.env.<env>`
- `containers/socket/docker/.env.<env>`
- `containers/frontend/docker/.env.<env>`
- `containers/database/docker/.env.<env>`

## Public app URL

`setup-env.sh` writes the app's public URL into backend, frontend, and socket env files. If you already know the hostname you want to use, you can run the script non-interactively:

`PUBLIC_APP_URL=https://your-host.example APP_ENV=development sh scripts/env/setup-env.sh development`

This keeps `APP_BASE_URL`, `GOOGLE_CALLBACK_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SOCKET_URL`, and `SOCKET_CORS_ORIGINS` aligned.

## Socket service runtime env

`setup-env.sh` generates a dedicated `containers/socket/docker/.env.<env>` file. Only shared variables are synchronized between services: currently `SOCKET_INTERNAL_SECRET` is generated once and written to both backend and socket env files.

For backend secrets, `setup-env.sh` also generates secure random values when missing. This now includes both `SESSION_SECRET` and `PUBLIC_API_KEY`.

## Quick tunnel

Use `make tunnel-quick` to start the Cloudflare Quick Tunnel for the dev stack. The helper waits for the `trycloudflare.com` URL, syncs it back into the generated env files, and recreates the services that need the new hostname.

Use `make tunnel` as the default entrypoint. It will:

- prefer the stable named tunnel when `containers/cloudflared/.env.development` contains both `CLOUDFLARE_TUNNEL_TOKEN` and `CLOUDFLARE_PUBLIC_URL`
- otherwise fall back to the Quick Tunnel flow

Use `make tunnel-logs` to follow the tunnel logs and `make tunnel-down` to stop it.

Quick Tunnel hostnames are ephemeral. If you use Google OAuth, the authorized redirect URI must match the current tunnel URL.

## Stable tunnel

If you already have a named Cloudflare tunnel, create `containers/cloudflared/.env.development`
from `containers/cloudflared/.env.development.example` and set:

- `CLOUDFLARE_TUNNEL_TOKEN`
- `CLOUDFLARE_PUBLIC_URL`

Then run `make tunnel-stable`.

Once those values exist, `make tunnel` will automatically prefer the stable tunnel over Quick Tunnel.

## Google OAuth notes

Google OAuth in this project is host-sensitive:

- `GOOGLE_CALLBACK_URL` must exactly match the public URL currently written into `containers/backend/docker/.env.<env>`
- Quick Tunnel hostnames change, so the Google OAuth redirect URI must be updated every time the tunnel URL changes
- the `/api/auth/google` start route now redirects `localhost` requests to the configured public host before creating OAuth state

For the most reliable flow:

- prefer opening the app from the public tunnel URL when testing Google login
- if you just changed tunnel URLs, retry from a fresh incognito/private window so old cookies from the previous host do not interfere

## Template files

Tracked example templates live next to the generated files as `*.example` files. Update those templates when a new variable is added so the local setup stays reproducible without committing secrets.

## Certificates

The setup script bootstraps the local certificates in `certs/` when they are missing. The frontend server and the HTTPS compose stack expect the leaf cert pair at `/certs/localhost.key` and `/certs/localhost.crt` with `ca.pem` as the trust root.
