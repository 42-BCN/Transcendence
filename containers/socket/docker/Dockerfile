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

COPY socket/docker/.bashrc /root/.bashrc
COPY socket/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY socket/app/package.json socket/app/package-lock.json* ./
RUN for attempt in 1 2 3; do \
      npm ci && exit 0; \
      echo "npm ci failed on attempt ${attempt}, retrying..." >&2; \
      sleep $((attempt * 10)); \
    done; \
    exit 1

COPY socket/app ./
COPY contracts ./src/contracts

EXPOSE 3100

ENTRYPOINT ["docker-entrypoint.sh"]


FROM base AS dev

CMD ["npm", "run", "dev"]


FROM base AS prod

RUN npm run build

CMD ["npm", "run", "start"]
