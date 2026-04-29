FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache bash tree coreutils curl

COPY frontend/docker/.bashrc /root/.bashrc

COPY frontend/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY frontend/web/package.json frontend/web/package-lock.json ./
RUN npm ci

COPY frontend/web ./
COPY contracts ./src/contracts

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]

FROM base AS dev

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]


FROM base AS prod

ENV NODE_ENV=production
ENV API_BASE_URL=https://backend:4000
ENV NEXT_PUBLIC_APP_URL=https://localhost:8443
ENV NEXT_PUBLIC_API_BASE_URL=/api
ENV NEXT_PUBLIC_SOCKET_URL=https://localhost:8443
ENV NEXT_PUBLIC_LOCALE_COOKIE_NAME=locale

RUN npm run build

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]