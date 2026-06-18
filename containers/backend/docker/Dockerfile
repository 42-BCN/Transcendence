FROM node:22.13-alpine AS base

WORKDIR /app

RUN apk add --no-cache bash tree coreutils curl
ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_FACTOR=2 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_NETWORK_TIMEOUT=120000 \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

COPY backend/docker/.bashrc /root/.bashrc

COPY backend/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY backend/app/package.json backend/app/package-lock.json ./
RUN for attempt in 1 2 3; do \
      npm ci && exit 0; \
      echo "npm ci failed on attempt ${attempt}, retrying..." >&2; \
      sleep $((attempt * 10)); \
    done; \
    exit 1

COPY backend/app ./
COPY contracts ./src/contracts

ENV PORT=4000
EXPOSE 4000

ENTRYPOINT ["docker-entrypoint.sh"]


FROM base AS dev

CMD ["npm", "run", "dev"]


FROM base AS prod

ENV NODE_ENV=production
ENV PGUSER=build
ENV PGPASSWORD=build
ENV PGDATABASE=build
ENV PGHOST=postgres
ENV PGPORT=5432

RUN npm run prisma:generate
RUN npm run build

CMD ["npm", "run", "start"]
