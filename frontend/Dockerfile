# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /usr/src/app
ENV CI=true

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Build Shared Library (Replicating path structure from dev)
COPY shared /usr/src/shared
RUN cd /usr/src/shared && \
    pnpm install && \
    pnpm build

# 2. Install Frontend Dependencies
COPY frontend/package.json frontend/pnpm-lock.yaml ./
# Use frozen-lockfile for reproducible production builds
RUN pnpm install --no-frozen-lockfile

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# 3. Build Frontend
COPY frontend/ .
RUN pnpm run build

# Stage 2: Production Runner (Nginx)
FROM nginx:stable-alpine

# Copy your custom Nginx config
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
