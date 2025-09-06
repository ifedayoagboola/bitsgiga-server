# syntax=docker/dockerfile:1

##### Build #####
FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV CI=true NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false

# Dependencies first (layer cache)
COPY package*.json ./
RUN npm ci

# Project files
COPY . .
# build script should run prisma generate via your prebuild, then tsc
RUN npm run build

##### Runtime #####
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3210

# Runtime deps only
COPY package*.json ./
RUN npm ci --omit=dev && \
    apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl && rm -rf /var/lib/apt/lists/*

# App
COPY --from=build /app/dist ./dist
# (optional) if your app reads prisma schema at runtime:
# COPY prisma ./prisma

EXPOSE 3210
HEALTHCHECK --interval=15s --timeout=3s --retries=5 CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT||8080) + '/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node","dist/src/server.js"]
