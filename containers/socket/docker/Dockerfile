FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache bash tree coreutils curl

COPY socket/docker/.bashrc /root/.bashrc
COPY socket/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY socket/app/package.json socket/app/package-lock.json* ./
RUN npm ci

COPY socket/app ./
COPY contracts ./src/contracts

EXPOSE 3100

ENTRYPOINT ["docker-entrypoint.sh"]


FROM base AS dev

CMD ["npm", "run", "dev"]


FROM base AS prod

RUN npm run build

CMD ["npm", "run", "start"]