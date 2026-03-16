FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache bash tree coreutils
COPY docker/.bashrc /root/.bashrc
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh	

# Copy manifests for cache
COPY app/package.json app/package-lock.json* ./
RUN npm ci || npm install --legacy-peer-deps || true

# Copy app source into image (will be overridden by bind mount in dev)
COPY app ./
EXPOSE 3100
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]