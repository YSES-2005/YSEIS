# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /usr/src/app
ENV CI=true
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Build Shared Library
COPY shared /usr/src/shared
RUN cd /usr/src/shared && \
    pnpm install && \
    pnpm build && \
    pnpm prune --prod

# 2. Install Backend Dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# 3. Build Backend
COPY backend/ .
RUN pnpm run build

# 4. Prune Backend (Remove devDependencies)
RUN pnpm prune --prod

# Stage 2: Production Runner
FROM node:20-slim

WORKDIR /usr/src/app
ENV NODE_ENV=production

# 1. Copy Shared (Must maintain the same path for symlinks to work)
COPY --from=builder /usr/src/shared /usr/src/shared

# 2. Copy Production Dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

# 3. Copy Built Artifacts
# Check your tsconfig.json to confirm if output is 'dist' or 'build'
COPY --from=builder /usr/src/app/dist ./dist

# Security: Run as non-root user
USER node

EXPOSE 5000

# Run the compiled JS file
CMD ["node", "dist/server.js"]
