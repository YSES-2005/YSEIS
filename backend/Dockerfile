# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /usr/src/app
ENV CI=true
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared ./shared
COPY backend/package.json ./backend/

RUN pnpm install --frozen-lockfile --filter ./shared... --filter ./backend...
RUN pnpm --filter ./shared run build

COPY backend/ ./backend/
RUN pnpm --filter ./backend run build

# Stage 2: Production Runner
FROM node:20-slim

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/shared /usr/src/app/shared
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/scripts/seed.js ./scripts/seed.js
COPY --from=builder /usr/src/app/backend/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend_node_modules

EXPOSE 5000

CMD ["node", "dist/server.js"]
