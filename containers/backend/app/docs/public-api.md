# Public API

This project now exposes a dedicated API-key-protected public API under `/public-api`.

## Authentication

Send the API key in the `x-api-key` header:

```http
x-api-key: <PUBLIC_API_KEY>
```

If `PUBLIC_API_KEY` is missing, the backend now fails fast during startup instead of booting with a broken public API.

## Rate limiting

All `/public-api` requests are rate limited in Redis per `x-api-key + client IP`.

- Default global limit: `120` requests per `60` seconds
- Default search limit: `30` requests per `60` seconds

Optional environment variables:

- `PUBLIC_API_KEY`
- `PUBLIC_API_RATE_LIMIT_MAX`
- `PUBLIC_API_RATE_LIMIT_WINDOW_MS`
- `PUBLIC_API_SEARCH_RATE_LIMIT_MAX`
- `PUBLIC_API_SEARCH_RATE_LIMIT_WINDOW_MS`

## Endpoints

| Method | Path | Description | DB-backed |
| --- | --- | --- | --- |
| `GET` | `/public-api/health` | Confirms Redis and Postgres are reachable | Yes |
| `GET` | `/public-api/users` | Paginated public users list | Yes |
| `GET` | `/public-api/users/count` | Total number of users | Yes |
| `GET` | `/public-api/users/search?q=<query>&limit=<n>` | Public username search | Yes |
| `GET` | `/public-api/users/username/:username` | Fetch a user by username | Yes |
| `GET` | `/public-api/users/:userId` | Fetch a user by id | Yes |

## Example

```bash
curl --cacert ./certs/ca.pem \
  -H "x-api-key: $PUBLIC_API_KEY" \
  "https://localhost:8443/api/public-api/users?limit=10&offset=0"
```

## Smoke Test From Host

From the repo root:

```bash
./scripts/smoke-public-api.sh development
./scripts/smoke-public-api.sh test
```

The wrapper runs the backend smoke suite from your host machine, loads `PUBLIC_API_KEY` from `containers/backend/docker/.env.<env>`, and trusts the local repo CA at `certs/ca.pem`.

You can still override the target if needed, for example:

```bash
BASE_URL=https://localhost:8443/api/ ./scripts/smoke-public-api.sh development
```

Or override the CA bundle explicitly:

```bash
HOST_NODE_EXTRA_CA_CERTS=/absolute/path/to/ca.pem ./scripts/smoke-public-api.sh development
```

## OpenAPI

The OpenAPI description for these endpoints lives in [openapi.yaml](./openapi.yaml).
