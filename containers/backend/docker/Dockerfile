FROM node:22.13-alpine AS base

WORKDIR /app

RUN apk add --no-cache bash tree coreutils curl

COPY backend/docker/.bashrc /root/.bashrc

COPY backend/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY backend/app/package.json backend/app/package-lock.json ./
RUN npm ci

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