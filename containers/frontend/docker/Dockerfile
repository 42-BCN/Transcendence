FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache bash tree coreutils curl
ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_FACTOR=2 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_NETWORK_TIMEOUT=120000 \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

COPY frontend/docker/.bashrc /root/.bashrc

COPY frontend/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY frontend/web/package.json frontend/web/package-lock.json ./
RUN for attempt in 1 2 3; do \
      npm ci && exit 0; \
      echo "npm ci failed on attempt ${attempt}, retrying..." >&2; \
      sleep $((attempt * 10)); \
    done; \
    exit 1

COPY frontend/web ./
COPY contracts ./src/contracts

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]

FROM base AS dev

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]


FROM base AS prod

ENV NODE_ENV=production
ENV API_BASE_URL=https://backend:4000

# Build-time arguments for NEXT_PUBLIC_* variables (inlined at build time, not configurable at runtime)
ARG NEXT_PUBLIC_APP_URL=https://localhost:8443
ARG NEXT_PUBLIC_API_BASE_URL=/api
ARG NEXT_PUBLIC_SOCKET_URL=https://localhost:8443
ARG NEXT_PUBLIC_LOCALE_COOKIE_NAME=locale

RUN NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
    NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
    NEXT_PUBLIC_SOCKET_URL="$NEXT_PUBLIC_SOCKET_URL" \
    NEXT_PUBLIC_LOCALE_COOKIE_NAME="$NEXT_PUBLIC_LOCALE_COOKIE_NAME" \
    npm run build

CMD ["npm", "run", "start"]
