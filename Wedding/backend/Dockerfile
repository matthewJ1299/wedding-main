FROM node:22-bookworm-slim

WORKDIR /app

RUN set -eux; \
  apt-get update -o Acquire::Retries=5; \
  apt-get install -y --no-install-recommends ca-certificates postgresql-client; \
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
