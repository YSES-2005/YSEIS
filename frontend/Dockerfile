# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /usr/src/app
ENV CI=true

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Build Shared
COPY shared /usr/src/shared
RUN cd /usr/src/shared && \
    pnpm install && \
    pnpm build

# 2. Install Frontend Dependencies
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile --os=linux --cpu=x64 --dangerously-allow-all-builds

# 3. Build Frontend
# Capture the API URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY frontend/ .
RUN pnpm run build

# Stage 2: Production Runner (Node)
FROM node:20-slim

WORKDIR /usr/src/app

# Install a simple static file server
RUN npm install -g serve

# Copy the built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# Start the server
# -s: Single Page App mode (rewrites 404 to index.html)
# -l: Listen on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
