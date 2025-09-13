# syntax=docker/dockerfile:1

##### Stage: deps (install + generate) #####
FROM node:20-bookworm-slim AS deps
WORKDIR /app
ENV CI=true NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false

# Install deps with prisma CLI available
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
# generate prisma client (uses prisma from devDeps)
RUN npx prisma generate

##### Stage: build (ts -> js) #####
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# your prebuild runs prisma generate too (fine), then compile
RUN npm run build

##### Stage: runtime (prod deps only) #####
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=development PORT=3210

# Prod deps only
COPY package*.json ./
RUN npm ci --omit=dev && \
    apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl && rm -rf /var/lib/apt/lists/*

# App code
COPY --from=build /app/dist ./dist

# **Bring in the generated Prisma client + engines**
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=build /app/prisma ./prisma

EXPOSE 3210
HEALTHCHECK --interval=15s --timeout=3s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT||3210) + '/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node","dist/src/server.js"]