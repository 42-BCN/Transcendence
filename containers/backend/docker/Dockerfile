FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash tree coreutils curl

COPY docker/.bashrc /root/.bashrc

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy manifests for cache
COPY app/package.json app/package-lock.json* ./

RUN npm ci || true

# Copy app source into image (will be overridden by bind mount in dev)
COPY app ./

ENV PORT 4000
EXPOSE 4000


ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]