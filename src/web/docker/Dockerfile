FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash tree coreutils

COPY docker/.bashrc /root/.bashrc

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy manifests for cache
COPY apps/web/package.json apps/web/package-lock.json* ./

RUN npm ci || true

# Copy app source into image (will be overridden by bind mount in dev)
COPY apps/web ./

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
