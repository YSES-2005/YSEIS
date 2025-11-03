FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* ./

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --silent
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/dist ./dist

# Ensure pnpm is available in the runtime for any lightweight global installs
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm add -g serve --silent
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
