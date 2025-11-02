FROM node:20-alpine

WORKDIR /usr/src/app

# copy lock and manifest first to install deps (use pnpm)
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --silent

# copy rest of the sources and build TypeScript
COPY . .
RUN pnpm run build --silent

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
