# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /usr/src/app
ENV CI=true

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared ./shared
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile --filter ./shared... --filter ./frontend...
RUN pnpm --filter ./shared run build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY frontend/ ./frontend/
RUN pnpm --filter ./frontend run build

# Stage 2: Production Runner (Node)
FROM node:20-slim

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /usr/src/app/frontend/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
