# Public API

This backend exposes a dedicated read-only public API protected by a shared API key.

- External base path through the running container stack: `/api/public-api`
- Raw Express mount inside the backend container: `/public-api`

## Authentication

Send the API key in the `x-api-key` header:

```http
x-api-key: <PUBLIC_API_KEY>
```

If `PUBLIC_API_KEY` is missing, the backend fails fast during startup instead of booting with a broken public API surface.

## Response shape

Successful responses use:

```json
{ "ok": true, "data": {} }
```

Errors use:

```json
{ "ok": false, "error": { "code": "AUTH_UNAUTHORIZED" } }
```

## Rate limiting

All `/public-api` routes are rate limited in Redis per `x-api-key + client IP`.

- Default global limit: `120` requests per `60` seconds
- Default search limit: `30` requests per `60` seconds on `GET /users/search`

Optional environment variables:

- `PUBLIC_API_KEY`
- `PUBLIC_API_RATE_LIMIT_MAX`
- `PUBLIC_API_RATE_LIMIT_WINDOW_MS`
- `PUBLIC_API_SEARCH_RATE_LIMIT_MAX`
- `PUBLIC_API_SEARCH_RATE_LIMIT_WINDOW_MS`

## Endpoints

| Method | External Path | Express Route | Description |
| --- | --- | --- | --- |
| `GET` | `/api/public-api/health` | `/public-api/health` | Confirms Redis and Postgres are reachable after API key validation |
| `GET` | `/api/public-api/users` | `/public-api/users` | Paginated public users list with `limit` and `offset` |
| `GET` | `/api/public-api/users/count` | `/public-api/users/count` | Total number of public users |
| `GET` | `/api/public-api/users/search?q=<query>&limit=<n>` | `/public-api/users/search` | Case-insensitive username search |
| `GET` | `/api/public-api/users/username/:username` | `/public-api/users/username/:username` | Fetch a public user by username |
| `GET` | `/api/public-api/users/:userId` | `/public-api/users/:userId` | Fetch a public user by id |

## Examples

List users through nginx:

```bash
curl --cacert ./certs/ca.pem \
  -H "x-api-key: $PUBLIC_API_KEY" \
  "https://localhost:8443/api/public-api/users?limit=10&offset=0"
```

Live health response:

```json
{
  "ok": true,
  "data": {
    "database": "up",
    "redis": "up"
  }
}
```

Unauthorized response:

```json
{
  "ok": false,
  "error": {
    "code": "AUTH_UNAUTHORIZED"
  }
}
```

## Smoke Test From Host

Run these from the repo root on your host machine:

```bash
./scripts/smoke-public-api.sh development
./scripts/smoke-public-api.sh test
```

The wrapper loads `PUBLIC_API_KEY` from `containers/backend/docker/.env.<env>`, trusts the repo CA at `certs/ca.pem`, and targets `https://localhost:8443/api/` by default.

Do not run this smoke flow from inside the backend container unless you also override `BASE_URL`, because the default `localhost:8443` target is the host nginx entrypoint.

You can still override the target if needed:

```bash
BASE_URL=https://localhost:8443/api/ ./scripts/smoke-public-api.sh development
```

Or override the CA bundle explicitly:

```bash
HOST_NODE_EXTRA_CA_CERTS=/absolute/path/to/ca.pem ./scripts/smoke-public-api.sh development
```

## OpenAPI

The OpenAPI description lives in [openapi.yaml](./openapi.yaml). It now covers the public API alongside the rest of the backend HTTP surface.
