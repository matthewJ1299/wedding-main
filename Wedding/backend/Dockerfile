FROM node:22-bookworm-slim

WORKDIR /app

RUN set -eux; \
  export DEBIAN_FRONTEND=noninteractive; \
  apt-get update -o Acquire::Retries=5; \
  for i in 1 2 3; do \
    apt-get install -y --no-install-recommends ca-certificates postgresql-client && break; \
    echo "apt-get install failed (attempt $i), retrying..." >&2; \
    sleep 2; \
    apt-get update -o Acquire::Retries=5; \
  done; \
  rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
